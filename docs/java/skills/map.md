# Map

## 是否为空

```java
map.isEmpty();
// true
```

## 不存在则新增

```java
// 原始方法
if (!map.containsKey("java")) {
    map.put("java", java);
}

map.putIfAbsent("java", java);
map.computeIfAbsent("java", k -> new Project(k));
```

## 存在则更新

```java
map.computeIfPresent("java", (key, value) -> new Project("java 17"));
```

::: danger

当更新值为null时, 会有如下两种情况:

- 旧值为null, 不变
- 旧值不为null, 删除其key

:::
