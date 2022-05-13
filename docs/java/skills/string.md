# 字符串

## 优雅拼接

使用`Apache Commons`的`StringUtils`

```java
public class Test {
  public static void main(String[] args) {
    // abc
    System.out.println(StringUtils.join("a", "b", "c"));
    String[] data = new String[]{"a", "b", "c"};
    // abc
    System.out.println(StringUtils.join(data));
    // a,b,c
    System.out.println(StringUtils.join(data, ","));
    // a,b
    System.out.println(StringUtils.join(data, ",", 0, 2));
  }
}
```