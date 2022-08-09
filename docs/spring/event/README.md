# 事件

Spring事件主要包含如下内容: 事件源/事件/广播器/监听器

## 内置事件

- `ContextRefreshedEvent`：IOC容器刷新完毕但尚未启动，广播该事件
- `ContextClosedEvent`：IOC容器已经关闭但尚未销毁所有Bean ，广播该事件
- `ContextStartedEvent`：`ApplicationContext`的`start`方法被触发，广播该事件
- `ContextStoppedEvent`：`ApplicationContext`的`stop`方法被触发，广播该事件

## 监听器

- 接口式监听器: 实现接口`ApplicationListener`
- 注解式监听器: 使用注解`@EventListener`

默认触发顺序如下:

1. 注解式监听器
2. 接口式监听器

可以使用`@Order`调整触发顺序, 其默认值为`Integer.MAX_VALUE`, 代表触发顺序为**最后**

## 自定义事件

### 创建事件类

```java
/**
 * 登录成功的事件
 */
public class LoginSuccessEvent extends ApplicationEvent {
    
    public LoginSuccessEvent(Object source) {
        super(source);
    }
}
```

### 编写监听器

```java
@Component
public class LoginTaskListener {
    
    @EventListener
    public void onLoginSuccess(LoginSuccessEvent event) {
        System.out.println("监听到用户登录成功, 完成登录任务");
    }
}
```

### 编写事件发布者

```java
@Component
public class LoginService implements ApplicationEventPublisherAware {
    
    ApplicationEventPublisher publisher;
    
    public void login(String username, String password) {
        // 用户登录逻辑...
        publisher.publishEvent(new LoginSuccessEvent(username));
    }
    
    @Override
    public void setApplicationEventPublisher(ApplicationEventPublisher publisher) {
        this.publisher = publisher;
    }
}
```

## 应用场景

在Spring Web项目中, 当你想使用事件时, 请再仔细思考一下

其大部分应用场景可被其它方案替换, 且替换它的方案逻辑思路更加清晰, **代码可读性更高**

尤其是在工作中, **不要为了设计而设计**
