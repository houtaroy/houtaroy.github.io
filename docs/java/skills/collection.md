# 集合

## List

### 去重

```java
public class Test {
  public static void main(String[] args) {
    List<Integer> one = Arrays.asList(1, 2, 3, 3);
    List<Integer> two = new ArrayList<>(new TreeSet<>(one));
    System.out.println(two);
  }
}
```

### 排序

使用lambda表达式对数组进行简单排序

```java
@Data
public class Project {
    private Long stars;
}

public class Test {
    public static void main(String[] args) {
        List<Project> projects = new ArrayList<>();
        projects.sort(Comparator.comparing(Project::getStar));
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

使用谷歌工具类`Guava`中的`Sets`

```java
public class Test {

  public static void main(String[] args) {
        Set<Integer> one = new HashSet<>(Arrays.asList(1, 2, 3));
        Set<Integer> two = new HashSet<>(Arrays.asList(2, 3, 4));
        // 并集 [1, 2, 3, 4]
        Sets.union(one, two);
        // 交集 [2, 3]
        Sets.intersection(one, two);
        // 差集 [1]
        Sets.difference(one, two);
        // 补集 [1, 4]
        Sets.symmetricDifference(one, two);
  }
}
```