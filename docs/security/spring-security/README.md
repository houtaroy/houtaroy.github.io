# Spring Security 5

谈到认证授权, 自然离不开OAuth

OAuth是互联网标准协议, 目前最新版本为2.1

在Spring体系下, 一般采用Spring Security + OAuth2的解决方案

但在百度搜索Spring Security OAuth2时

其结果中大部分使用的仍是[spring-security-oauth](https://github.com/spring-attic/spring-security-oauth)

打开其Github首页, 可以发现此项目已被设置为只读且说明了不再主动维护:

![spring-security-oauth](./spring-security-oauth.png)

Spring Security 5.7.1于前段时间发布, 都2022年了, 让孩子升升级吧

## 需求

暂且抛开技术栈思考, 实现一个基础的认证授权服务, 需要包含什么内容呢?

根据笔者的经验, 大致如下:

- 权限模型: RBAC
- 授权类型: 支持密码模式登录
- 认证信息: [JWT(**J**SON **W**eb **T**okens)](https://jwt.io/), 也就是我们常说的token
- 持久化: 数据库

有了具体的目标, 只需要寻找合适的实现方案即可, 我们可以按照如下流程进行:

1. 选择开源授权服务项目
2. 创建数据库
3. 实现密码模式登录和JWT
4. 持久化认证授权信息

## 开源授权服务项目

开头提到了`spring-security-oauth`已属于半废弃状态

但它的替代品Spring Authorization Server刚刚发布了0.3.0版本, 且官网上线了对应的[文档](https://docs.spring.io/spring-authorization-server/docs/current/reference/html/)

本文将会选择它作为OAuth2授权服务的基础

但Spring Authorization Server是基于**OAuth2.1协议**的, 其中**删除了对密码模式的支持**

需要我们手动进行实现

## 创建数据库

在数据库中我们需要创建如下两种内容的表:

- Spring Authorization Server持久化表
- RBAC模型表

Spring Authorization Server持久化表可参照文件: <a href="spring-authorization-server-schema.sql" download>spring-authorization-server-schema.sql</a>

RBAC模型是老生常谈, 不再赘述, 大致包含如下表: t_user/t_role/t_permission/t_api/t_user_role/t_role_permission/t_permission_api

## 密码模式登录

::: tip

此内容为整个认证授权服务的核心, 请耐心阅读

:::

### 认证请求

在Spring Security中, 可以将认证请求拆分为如下内容:

![认证授权流程](./认证请求流程.jpg)

结合文档并阅读源码, 以客户端凭证模式为例, 可以得出在整个认证请求过程中的关键类:

- `Authentication`: 认证信息, 贯穿整个认证请求流程, 包含多种, 如`OAuth2ClientCredentialsAuthenticationToken`/`OAuth2AccessTokenAuthenticationToken`
- `AuthenticationConverter`: 认证请求转换器, 将请求转换为`Authentication`, 如`OAuth2ClientCredentialsAuthenticationConverter`
- `AuthenticationProvider`: 认证信息提供者, 提供最终的认证授权信息, 如`OAuth2ClientCredentialsAuthenticationProvider`

*在客户端凭证模式的认证请求中, 上图第三步`Authentication`为`OAuth2ClientCredentialsAuthenticationToken`, 第五步为`OAuth2AccessTokenAuthenticationToken`*

所以, 想要手动实现密码模式, 我们只需要完成三个关键类的编码:

1. `OAuth2ResourceOwnerPasswordAuthenticationConverter`
2. `OAuth2ResourceOwnerPasswordAuthenticationToken`
3. `OAuth2ResourceOwnerPasswordAuthenticationProvider`

### 关键类编码

::: warning

编码内容为简略版, 完整源码请参考项目[Koala](https://github.com/Houtaroy/koala)

:::

`OAuth2ResourceOwnerPasswordAuthenticationConverter`:

```java
public class OAuth2ResourceOwnerPasswordAuthenticationConverter implements AuthenticationConverter {
  @Override
  public OAuth2ResourceOwnerPasswordAuthenticationToken convert(HttpServletRequest request) {
    if (isNotSupport(request)) {
      return null;
    }
    // 参数校验
    OAuth2Helper.requiredParameter(request, OAuth2ParameterNames.CLIENT_ID);
    OAuth2Helper.requiredParameter(request, OAuth2ParameterNames.CLIENT_SECRET);
    return new OAuth2ResourceOwnerPasswordAuthenticationToken(
      AuthorizationGrantType.PASSWORD,
      OAuth2Helper.getClientPrincipalOrThrowException(),
      // 用户名密码认证信息, 用于后续校验
      new UsernamePasswordAuthenticationToken(
        OAuth2Helper.getParameterOrThrowException(request, OAuth2ParameterNames.USERNAME),
        OAuth2Helper.getParameterOrThrowException(request, OAuth2ParameterNames.PASSWORD)
      ),
      null
    );
  }

  protected boolean isNotSupport(HttpServletRequest request) {
    return !AuthorizationGrantType.PASSWORD.getValue().equals(request.getParameter(OAuth2ParameterNames.GRANT_TYPE));
  }
}
```

`OAuth2ResourceOwnerPasswordAuthenticationToken`:

```java
public class OAuth2ResourceOwnerPasswordAuthenticationToken extends OAuth2AuthorizationGrantAuthenticationToken {
  protected UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken;

  /**
   * 构造函数
   *
   * @param authorizationGrantType              授权类型
   * @param clientPrincipal                     客户端信息
   * @param usernamePasswordAuthenticationToken 用户密码认证Token
   * @param additionalParameters                附加参数
   */
  public OAuth2ResourceOwnerPasswordAuthenticationToken(@NonNull AuthorizationGrantType authorizationGrantType,
                                                        @NonNull OAuth2ClientAuthenticationToken clientPrincipal,
                                                        @NonNull UsernamePasswordAuthenticationToken
                                                          usernamePasswordAuthenticationToken,
                                                        @Nullable Map<String, Object> additionalParameters) {
    super(authorizationGrantType, clientPrincipal, additionalParameters);
    this.usernamePasswordAuthenticationToken = usernamePasswordAuthenticationToken;
  }

  public RegisteredClient getRegisteredClientOrThrowException() {
    return Optional.ofNullable(getPrincipal())
      .map(OAuth2ClientAuthenticationToken.class::cast)
      .map(OAuth2ClientAuthenticationToken::getRegisteredClient)
      .orElseThrow(() -> new NullPointerException("注册客户端不存在"));
  }
}
```

`OAuth2ResourceOwnerPasswordAuthenticationProvider`:

```java
@RequiredArgsConstructor
public class OAuth2ResourceOwnerPasswordAuthenticationProvider implements AuthenticationProvider {
  protected final AuthenticationManager authenticationManager;
  protected final JwtEncoder jwtEncoder;
  protected final OAuth2AuthorizationService oAuth2AuthorizationService;
  protected final ProviderProperties providerProperties;

  @Override
  public OAuth2AccessTokenAuthenticationToken authenticate(Authentication authentication)
    throws AuthenticationException {
    OAuth2ResourceOwnerPasswordAuthenticationToken token =
      (OAuth2ResourceOwnerPasswordAuthenticationToken) authentication;
    RegisteredClient registeredClient = token.getRegisteredClientOrThrowException();
    // 用户名密码登录
    Authentication userPrincipal = authenticationManager.authenticate(token.getUsernamePasswordAuthenticationToken());
    // 获取授权信息
    Set<String> authorities = getAuthorities(userPrincipal);
      
    // 生成JWT
    Instant issuedAt = Instant.now();
    Jwt jwt = jwtEncoder.encode(
      JwtEncoderParameters.from(
        JwsHeader.with(SignatureAlgorithm.RS256).build(),
        JwtClaimsSet.builder().issuer(providerProperties.getIssuer())
          .subject(userPrincipal.getName())
          .issuedAt(issuedAt)
          .expiresAt(issuedAt.plus(registeredClient.getTokenSettings().getAccessTokenTimeToLive()))
          .notBefore(issuedAt)
          .claim(OAuth2ParameterNames.SCOPE, authorities)
          .build()
      )
    );

    OAuth2AccessToken accessToken = new OAuth2AccessToken(
      OAuth2AccessToken.TokenType.BEARER,
      jwt.getTokenValue(),
      jwt.getIssuedAt(),
      jwt.getExpiresAt(),
      authorities
    );

    // 保存认证授权信息
    oAuth2AuthorizationService.save(
      OAuth2Authorization.withRegisteredClient(registeredClient)
        .principalName(userPrincipal.getName())
        .authorizationGrantType(AuthorizationGrantType.PASSWORD)
        .token(accessToken, (metadata) -> metadata.put(OAuth2Authorization.Token.CLAIMS_METADATA_NAME, jwt.getClaims()))
        .attribute(OAuth2Authorization.AUTHORIZED_SCOPE_ATTRIBUTE_NAME, authorities)
        .attribute(Principal.class.getName(), userPrincipal)
        .build()
    );

    return new OAuth2AccessTokenAuthenticationToken(registeredClient, userPrincipal, accessToken);
  }

  @Override
  public boolean supports(Class<?> authentication) {
    return OAuth2ResourceOwnerPasswordAuthenticationToken.class.isAssignableFrom(authentication);
  }

  protected Set<String> getAuthorities(Authentication authentication) {
    return authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toSet());
  }
}
```

### 认证服务配置

完成核心类编码后, 需要我们对安全过滤链进行手动配置:

```java
@EnableConfigurationProperties(ProviderProperties.class)
public class AuthorizationServerConfig {
    
  /**
   * 认证服务安全过滤链的bean
   *
   * @param http                       HttpSecurity
   * @param oauth2AuthorizationService 认证授权服务
   * @param providerProperties         提供者配置
   * @return 认证服务安全过滤链
   * @throws Exception 异常
   */
  @Bean
  @Order(Ordered.HIGHEST_PRECEDENCE)
  public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                 OAuth2AuthorizationService oauth2AuthorizationService,
                                                 ProviderProperties providerProperties) throws Exception {
    OAuth2AuthorizationServerConfigurer<HttpSecurity> authorizationServerConfigurer =
      new OAuth2AuthorizationServerConfigurer<>();
    // 增加认证请求转换
    // 这里不增加Provider是因为没有build前无法获得AuthenticationManager和JwtEncoder
    authorizationServerConfigurer
      .tokenEndpoint(tokenEndpoint ->
        tokenEndpoint
          .accessTokenRequestConverter(new OAuth2ResourceOwnerPasswordAuthenticationConverter())
      );
    RequestMatcher endpointsMatcher = authorizationServerConfigurer.getEndpointsMatcher();
    http.requestMatcher(endpointsMatcher)
      .authorizeRequests(authorizeRequests -> authorizeRequests.anyRequest().authenticated())
      .csrf(csrf -> csrf.ignoringRequestMatchers(endpointsMatcher))
      .apply(authorizationServerConfigurer);
    // build过滤链, 生成AuthenticationManager和JwtEncoder用于Provider
    SecurityFilterChain result = http.build();
    // 增加认证信息提供者
    http.authenticationProvider(new OAuth2ResourceOwnerPasswordAuthenticationProvider(
      http.getSharedObject(AuthenticationManager.class),
      http.getSharedObject(JwtEncoder.class),
      oauth2AuthorizationService,
      providerProperties
    ));
    return result;
  }
}
```

### 安全配置

认证服务配置完成后, 需要管理接口权限的资源服务, 需要完成对应的安全配置:

```java
// 开启接口权限校验
@EnableGlobalMethodSecurity(jsr250Enabled = true, prePostEnabled = true, securedEnabled = true)
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfiguration {
/**
   * 授权服务器默认安全过滤器链配置
   *
   * @param http HttpSecurity对象
   * @return 安全过滤器链实例
   * @throws Exception 异常
   */
  @Bean
  SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http, JwtDecoder jwtDecoder) throws Exception {
    // 默认授权前缀为SCOPE_, 修改其为空
    JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
    grantedAuthoritiesConverter.setAuthorityPrefix("");
    JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
    converter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
    return http.authorizeRequests().anyRequest().authenticated()
      .and()
      .oauth2ResourceServer(oauth2 ->
        oauth2.jwt(jwt -> jwt.decoder(jwtDecoder).jwtAuthenticationConverter(converter))
      ).build();
  }
}
```

至此为止, 整个Spring Security + OAuth2的密码模式登录全部完成(~~真的如此吗~~)

## 踩坑

### 认证授权信息ID

需求章节中提到了, 我们需要将认证授权信息保存在数据库中

那么**如何确定主键**呢?

笔者采用`用户名 + 注册客户端ID + 授权类型 + 授权范围`的MD5值

保存认证授权信息使用的是`OAuth2AuthorizationService`:

```java
public class KoalaJdbcOAuth2AuthorizationService extends JdbcOAuth2AuthorizationService {
  /**
   * 构造函数
   *
   * @param jdbcOperations             jdbc操作
   * @param registeredClientRepository 注册客户端存储库类
   */
  public KoalaJdbcOAuth2AuthorizationService(JdbcOperations jdbcOperations,
                                             RegisteredClientRepository registeredClientRepository) {
    super(jdbcOperations, registeredClientRepository);
  }

  @Override
  public void save(OAuth2Authorization authorization) {
    // 覆盖原有方法, 重新计算id
    super.save(OAuth2Authorization.from(authorization).id(generateAuthorizationId(authorization)).build());
  }

  protected String generateAuthorizationId(OAuth2Authorization authorization) {
    try {
      byte[] values = MessageDigest.getInstance("MD5").digest(
        Map.of(
          OAuth2ParameterNames.USERNAME, authorization.getPrincipalName(),
          OAuth2ParameterNames.CLIENT_ID, authorization.getRegisteredClientId(),
          OAuth2ParameterNames.GRANT_TYPE, authorization.getAuthorizationGrantType().getValue(),
          OAuth2ParameterNames.SCOPE, StringUtils.collectionToCommaDelimitedString(
            authorization.getAttribute(OAuth2Authorization.AUTHORIZED_SCOPE_ATTRIBUTE_NAME)
          )
        ).toString().getBytes(StandardCharsets.UTF_8)
      );
      return String.format("%032x", new BigInteger(1, values));
    } catch (NoSuchAlgorithmException e) {
      throw new IllegalStateException("MD5 algorithm not available.  Fatal (should be in the JDK).");
    }
  }
}
```

### 认证授权信息保存

认证授权信息会保存在数据库中, 其中包含了用户信息实体`UserEntity`

第一次登录时, 会创建新的token并保存, 正常运行

第二次登陆时, 根据上一个坑中的唯一ID, 从数据库读取认证授权信息, **`UserEntity`将进行反序列化**, 出现如下错误:

`Could not read JSON: The class with cn.koala.system.entities.UserEntity and name of cn.koala.system.entities.UserEntity is not whitelisted. If you believe this class is safe to deserialize, please provide an explicit mapping using Jackson annotations or by providing a Mixin. If the serialization is only done by a trusted source, you can also enable default typing. See https://github.com/spring-projects/spring-security/issues/4370 for details`

网上有很多修改方式, 笔者推荐使用**注解`@JsonTypeInfo`**, 简单明了:

```java
@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS)
public class UserEntity extends BaseEntity implements User {
}
```

::: tip

如果属性中有嵌套对象, **嵌套对象也需要增加注解**

:::

## 拓展思考

- 如何提供Swagger支持?
- 如何实现动态权限?

