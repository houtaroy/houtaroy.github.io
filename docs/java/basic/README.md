# 基础知识

## 概念

### 结构

JVM(**J**ava **V**irtual **M**achine): Java虚拟机, 运行Java字节码的虚拟机, Java实现平台无关性的基础

JRE(**J**ava **R**untime **E**nvironment): Java运行环境, 包括JVM/Java类库/Java 命令/基础构件

JDK(**J**ava **D**evelopment **K**it): 面向Java开发人员的软件开发工具包, 包含JRE/部分工具

### 运行流程

![运行流程](./运行流程.jpg)

## 语法

### 关键字

| 关键字       | 说明         | 示例                                                 |
| ------------ | ------------ | ---------------------------------------------------- |
| abstract     | 抽象         | `abstract class`                                     |
| assert       | 断言         | `assert 1 == userId : "用户id错误"`                  |
| break        | 跳出循环     | `for (...) { break; }`                               |
| case         | switch选择器 | `switch (...) { case value: ... }`                   |
| catch        | 捕获异常     | `try { ... } catch (...) { ... }`                    |
| class        | 类           | `class MyClass { ... }`                              |
| const        | 保留关键字   | 无法使用                                             |
| continue     | 继续         | `for (...) { continue; }`                            |
| default      | 默认         | `default int add(int a, int b) { ... }`              |
| do           | 运行         | `do { ... } while (...)`                             |
| else         | 否则         | `if (...) { ... } else { ... }`                      |
| extends      | 继承         | `class Child extends Parent { ... }`                 |
| final        | 不可变的     | `private final String name`                          |
| finally      | 最终执行     | ``try { ... } catch (...) { ... } finally { ... }``  |
| for          | 循环         | `for (...) { ... }`                                  |
| goto         | 保留关键字   | 无法使用                                             |
| if           | 如果         | `if (...) { ... }`                                   |
| implements   | 实现接口     | `class MyClass implements MyInterface { ... }`       |
| import       | 引入         | `import ...`                                         |
| instanceof   | 类型判断     | `myClass instanceof MyClass`                         |
| interface    | 接口         | `interface MyInterface { ... }`                      |
| native       | 原生方法     | `private native void start()`                        |
| new          | 创建         | `MyClass myClass = new MyClass()`                    |
| package      | 包           | `packege ...`                                        |
| private      | 私有的       | `private String name`                                |
| protected    | 受保护的     | `protected String name`                              |
| public       | 公共的       | `public String name`                                 |
| return       | 返回         | `public void test { return; }`                       |
| static       | 静态的       | `public static final String name`                    |
| switch       | 根据值选择   | `switch (...) { ... }`                               |
| synchronized | 同步的       | `public synchronized void run() { ... }`             |
| throw        | 抛出异常     | `public void execute () {  throw new Exception(); }` |
| throws       | 声明抛出异常 | `public void execute () throws Exception { ... }`    |
| transient    | 暂时的       | `private transient String name`                      |
| try          | 异常执行     | `try { ... } catch (...) { ... }`                    |
| volatile     | 易变的       | `private volatile String name`                       |
| void         | 无返回值     | `public void test () { ... }`                        |
| while        | 循环         | `while (...) { ... }`                                |

### 运算符

| 运算符 | 说明       | 示例                 |
| ------ | ---------- | -------------------- |
| =      | 赋值       | `c = a`              |
| +      | 加法       | `c = a + b`          |
| -      | 减法       | `c = a - b`          |
| *      | 乘法       | `c = a * b`          |
| /      | 整除       | `c = a / b`          |
| %      | 取余       | `c = a % b`          |
| ++     | 自增       | `a++/++a`            |
| --     | 自减       | `a--/--a`            |
| ==     | 相等       | `boolean c = a == b` |
| !=     | 不相等     | `boolean c = a != b` |
| >      | 大于       | `boolean c = a > b`  |
| <      | 小于       | `boolean c = a < b`  |
| >=     | 大于等于   | `boolean c = a >= b` |
| <=     | 小于等于   | `boolean c = a <= b` |
| &      | 与         | `c = a & b`          |
| \|     | 或         | `c = a \| b`          |
| ^      | 异或       | `c = a ^ b`          |
| ~      | 取反       | `c = ~a`             |
| <<     | 左移       | `c = a << 2`         |
| >>     | 右移       | `c = a >> 2`         |
| >>>    | 右移补零   | `c = a >>> 2`        |
| &&     | 且         | `a && b`             |
| \|\|   | 或         | `a \|\| b`             |
| !      | 非         | `!(a && b)`          |
| ?:     | 三元运算符 | `a == b ? a : b`     |

### 函数

函数共有如下四种类型:

- 无参无返回值: `void test() {}`
- 无参有返回值: `int test() {}`
- 有参无返回值: `void test(int a) {}`
- 有参有返回值: `int test(int a) {}`

参数有一种特殊的声明方式, 可变长参数:

```java
public class Test {
    public void test(String... names) {
        Arrays.stream(names).forEach(System.out::println);
    }
}
```