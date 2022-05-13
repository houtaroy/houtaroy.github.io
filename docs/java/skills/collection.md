# 集合

## List

### 去重

```java
public class Test {
  public static void main(String[] args) {
    List<Integer> one = Arrays.asList(1, 2, 3, 3);
    List<Integer> two = new ArrayList<>(new TreeSet<>(one));
    // [1, 2, 3]
    System.out.println(two);
  }
}
```

### 排序

```java
public class Test {
  public static void main(String[] args) {
    List<Integer> one = Arrays.asList(1, 3, 2, 3);
    one.sort(Comparator.comparing(Integer::intValue));
    // [1, 2, 3, 3]
    System.out.println(one);
  }
}
```

### 转为Map

```java
@Data
public class Student {
  private String id;

  public Map<String, Student> toMap(List<Student> students) {
    return students.stream().collect(Collectors.toMap(Student::getId, s -> s));
  }
}
```

## Set

### Set运算

使用谷歌工具类`Apache Commons`中的`SetUtils`

```java
public class Test {
  public static void main(String[] args) {
    Set<Integer> one = new HashSet<>(Arrays.asList(1, 2, 3));
    Set<Integer> two = new HashSet<>(Arrays.asList(2, 3, 4));
    // 并集 [1, 2, 3, 4]
    System.out.println(SetUtils.union(one, two));
    // 交集 [2, 3]
    System.out.println(SetUtils.intersection(one, two));
    // 差集 [1]
    System.out.println(SetUtils.difference(one, two));
    // 补集 [1, 4]
    System.out.println(SetUtils.disjunction(one, two));
  }
}
```

