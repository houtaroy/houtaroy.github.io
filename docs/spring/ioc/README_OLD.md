# IoC

## 概念

IoC(**I**nversion **o**f **C**ontrol), 即控制反转, 是一种设计理念, 是Spring的核心功能之一

按照中文进阶解读, 我们往往会习惯于将重点放在`控制`这个词上, 但IoC的主要内容应是`反转`

先说结论, 控制反转是**对象获取依赖方式的反转**

在初学Java时, 我们经常会使用如下这种方式创建对象:

```java
B b = new B();
A a = new A(b);
```

在创建对象`a`之前, 必须先创建它依赖的参数`b`, 然后调用构造方法, 这种创建方式, 我们可以认为是`a`**主动获取**依赖`b`

当对象相互依赖的关系较小时, 还算能看

可当对象依赖的过多或依赖的层级过深时, 上述创建方式简直头大

那么, 设想一下, 如果每个对象之间都知道相互的关系, 并且在创建时会自动关联, 将会是一件多么美妙的事情啊

Spring好像就是这么做的:

```java
@Component
public class A {
    @Autowired
    private B b;
}
```

在Spring中, 我们无需主动创建`b`, 而是使用DI(**D**ependency **I**njection, 依赖注入)的方式将它**赋予**`a`

从主动获取变为赋予, 这就是所谓的**反转**

当然, 如果非要纠结`控制`这个词的话, 我们可以这么理解:

传统方式的对象创建, 需要开发人员手动编码, **对象的控制权在人手中**

而IoC中, 对象的创建一般交由程序自身, 例如Spring的IoC容器, **控制权从人反转到了程序**

::: warning

对象控制权反转并非官方解释, 仅用于理解和记忆

:::

## 依赖注入

依赖注入是Spring实现IoC的方式, 这里简单介绍下几种注入机制

### 多个同类型注入其一

假设存在多个类型为`B`的bean, 如果指定注入哪个?

使用`@Primary`:

```java
public class BeanConfig {
    @Bean
    @Primary
    public B one() {
        return new B();
    }
}
```

使用`@Qualifier`:

```java
@Component
public class A {
    @Autowired
    @Qualifier("one")
    private B b;
}
```

::: tip

`@Qualifier` 不受 `@Primary` 的干扰

:::

变量名:

```java
@Component
public class A {
    @Autowired
    private B one;
}
```

通过上述内容其实可以发现Spring依赖注入的流程:

![Spring依赖注入流程](./Spring依赖注入流程.jpg)

### 多个同类型全部注入

```java
@Component
public class A {
    @Autowired
    private List<B> bs;
}
```

### 回调注入

使用`ApplicationContextAware`获取`ApplicationContext`:

```java
public class BeanTest implements ApplicationContextAware {
    
    private ApplicationContext ctx;
    
    public void printBeanNames() {
        Stream.of(ctx.getBeanDefinitionNames()).forEach(System.out::println);
    }
    
    @Override
    public void setApplicationContext(ApplicationContext ctx) throws BeansException {
        this.ctx = ctx;
    }
}
```

### 延时注入

使用`ObjectProvider`, 可应用于setter/构造函数/属性, 以构造函数为例:

```java
@Component
public class A {
    private B b;
    
    @Autowired
    public void setB(ObjectProvider<B> b) {
        this.b = b.getIfAvailable();
    }
}
```

### 方式选择

Spring官方推荐使用**构造函数注入**, 并且指出了**如果构造函数的参数过长, 则代表其职责过多, 第一选择是对其进行拆解**, 而不是选择其它的依赖注入方式

## Bean

### 作用域

- 单例: 只存在一个
- 原型: 每次都创建新的

### 生命周期方法

按照方法类型可分为: 

- 初始化方法: `initMethod`/`@PostConstruct`
- 销毁方法: `destroyMethod`/`@PreDestroy`

按照声明方式可分为: 

- Spring: `@Bean(initMethod = "init", destroyMethod = "destroy")`
- JSR250: `@PostConstruct public void init() {}`

::: tip

Spring与JSR250可以共存, 优先级JSR250 > Spring

:::

生命周期方法有如下限制:

- 方法**无参数**

- 方法**无返回值**

- 方法**可以抛出异常**

- 访问权限无限制

在执行生命周期方法前, **Bean已完成属性赋值**

::: danger

作用域为原型的bean, 不支持`destroyMethod`

:::

## 装配

### 模块装配

`@Configuration` + `@Import` + `@Bean`

在开发模块时, 我们经常使用这种方式进行装配:

```java
@Configuration
@Import(MyBean.class)
public class MyBeanAutoConfig {
    
    @Bean
    public MyBeanTwo myBeanTwo() {
        return new MyBeanTwo();
    }
}
```

会在Spring中装配`MyBeanAutoConfig`/`MyBean`/`MyBeanTwo`

`@Import` + `ImportSelector`

手动实现`ImportSelector`, 返回一组全限定类名(即`cn.houtaroy.MyBean`):

```java
public class MyBeanImportSelector implements ImportSelector {
    
    @Override
    public String[] selectImports(AnnotationMetadata importingClassMetadata) {
        return new String[]{MyBean.class.getName()};
    }
}
```

`@Import` + `ImportBeanDefinitionRegistrar`

手动实现`ImportBeanDefinitionRegistrar`, 注册Bean的定义:

```java
public class MyBeanRegistrar implements ImportBeanDefinitionRegistrar {
    
    @Override
    public void registerBeanDefinitions(AnnotationMetadata metadata, BeanDefinitionRegistry registry) {
        registry.registerBeanDefinition("myBean", new RootBeanDefinition(MyBean.class));
    }
}
```

### 条件装配

顾名思义, 条件装配可以根据指定的条件进行装配, 它弥补了模块装配只要导入了就一定会装配的不足

#### Profile

可以理解为环境条件, 它代表着整个项目的运行环境:

```java
@Configuration
public class MyBeanAutoConfig {
    
    @Bean
    @Profile("development")
    public MyBean myBean() {
        return new MyBean();
    }
}
```

只有在环境为`development`时才会装配`MyBean`

::: tip

profile默认为`default`

:::

#### Conditional

`profile`控制的是整个项目的条件, `Conditional`则是针对单个Bean的

`Conditional`有许多注解, 以常用的`@ConditionalOnMissingBean`为例:

```java
@Configuration
public class MyBeanAutoConfig {
    
    @Bean
    @ConditionalOnMissingBean
    public MyBean myBean() {
        return new MyBean();
    }
}
```

当容器中不存在`MyBean`类型的Bean时, 才会装配

`Conditional`可以自定义, 详情参照上述`@ConditionalOnMissingBean`即可

### 扫描装配

使用注解`@ComponentScan`可以通过扫描指定的包路径实现装配

有如下两种常用方式:

- 指定包名: `@ComponentScan("cn.houtaroy.bean")`
- 指定类所在的包: `@ComponentScan(basePackageClasses = AutoScan.class)`

如果需要定制扫描规则, 可以使用过滤器, Spring默认提供了如下过滤器:

- 默认过滤器: 扫描指定包下的`@Component`/`@Repository`/`@Service`/`@Controller`
- 注解过滤器: `@ComponentScan(includeFilters = {@ComponentScan.Filter(type = FilterType.ANNOTATION, value = MyBean.class)})`
- 类型过滤器: `@ComponentScan(excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, value = Houtaroy.class))`
- 正则表达式过滤器: `@ComponentScan(includeFilters = @ComponentScan.Filter(type = FilterType.REGEX, pattern = "cn.houtaroy.+My.+"))`

当Spring提供的过滤器不满足要求时, 可以手动实现接口`TypeFilter`, 编写自定义过滤器:

```java
@Configuration
@ComponentScan(
    basePackages = "cn.houtaroy.bean",
    includeFilters = {@ComponentScan.Filter(type = FilterType.CUSTOM, value = MyTypeFilter.class)}
)
public class MyBeanAutoConfig {
    
}
```







