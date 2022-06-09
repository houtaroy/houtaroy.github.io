# 单例模式

什么是单例模式?

用一句话概括: **在整个系统中, 一个类只有一个实例**

再详细描述一下的话, 便是仅在第一次获取这个类的实例时生成一个并返回, 后续的所有获取都将返回第一次生成的实例, 不会再创建新的实例

和它概念相似的东西是全局变量

和它概念相悖的东西是构造函数, 因为构造函数总是返回一个新的实例

在Java中有两种实现单例模式的方式:

- 传统编码
- 枚举

::: tip

在多线程编程场景下, 强烈推荐枚举实现单例模式, 可参照之前的文章: [枚举](/java/skills/enum.md#单例模式)

:::

## 传统编码

### 单线程

参照刚才的详细描述, 我们可以很轻松的实现单例模式:

```java
public class Singleton {
  private static Singleton uniqueSingleton;

  private Singleton() {
  }

  public Singleton getInstance() {
    if (null == uniqueSingleton) {
      uniqueSingleton = new Singleton();
    }
    return uniqueSingleton;
  }
}
```

但为什么在多线程场景下, 这种方式会存在问题呢?

假设有两个线程同时调用`getInstance`, 可能会发生如下情形:

| 时间线 | 线程1                                                        | 线程2                                                        |
| ------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 1      | `uniqueSingleton`为null                                      | 待机                                                         |
| 2      | 待机                                                         | `uniqueSingleton`为null                                      |
| 3      | 待机                                                         | 执行`new Singleton()`, 创建对象`A`, 并赋值给`uniqueSingleton` |
| 4      | 待机                                                         | 返回`A`                                                      |
| 5      | 执行`new Singleton()`, 创建对象`B`, 并赋值给`uniqueSingleton` | 结束                                                         |
| 6      | 返回`B`                                                      | 结束                                                         |
| 结果   | 得到对象`B`                                                  | 得到对象`A`                                                  |

很明显, 结果是在单例模式中创建了两个对象, 违反了设计原理

### 多线程

多线程场景下存在关键字`synchronized`, 那代码可以修改为:

```java
public class Singleton {
  private static Singleton uniqueSingleton;

  private Singleton() {
  }

  public synchronized Singleton getInstance() {
    if (null == uniqueSingleton) {
      uniqueSingleton = new Singleton();
    }
    return uniqueSingleton;
  }
}
```

但这样**对性能的影响是非常大的**, 每次调用`getInstance()`都需要加锁

可实际上, 我们只需要在创建实例时加锁, 实例已经创建时并不需要

所以, 使用双重检查锁进行优化:

```java
public class Singleton {
  private static Singleton uniqueSingleton;

  private Singleton() {
  }

  public Singleton getInstance() {
    if (null == uniqueSingleton) {
      synchronized (Singleton.class) {
        if (null == uniqueSingleton) {
          uniqueSingleton = new Singleton();
        }
      }
    }
    return uniqueSingleton;
  }
}
```

到这里还没结束, Java中实例化对象一般是如下三个步骤:

1. 分配内存
2. 初始化对象
3. 将对象指向1中分配的内存

但某些编辑器会进行性能优化, 对2和3进行指令重排, 使他们顺序颠倒, 从而导致某些线程获取到还没完成初始化的对象

只需要使用`volatile`关键字修饰`uniqueSingleton`即可:

```java
public class Singleton {
  private static volatile Singleton uniqueSingleton;
    
  // 单例模式...
}
```

因为`volatile`的作用之一便是**禁止指令重排**

至此为止, 传统编码模式下的单例模式才算完整实现, 是不是非常麻烦?

这也是为什么推荐使用枚举实现单例模式, **因为枚举是天然线程安全的**