# 枚举

## 单例模式

```java
public enum PersonFactory {
    INSTANCE;

    public User create(String id) {
        return new User(id);
    }
}

public class Test {
    public static void main(String[] args) {
        // 输出: 1
        System.out.println(PersonFactory.INSTANCE.create("1").getId());
    }
}
```

## 状态模式

```java
public enum State {
  /**
   * 等待
   */
  WAIT {
    @Override
    public State start() {
      return RUNNING;
    }

    @Override
    public State stop() {
      return WAIT;
    }
  },
  
  /**
   * 运行
   */
  RUNNING {
    @Override
    public State start() {
      return RUNNING;
    }

    @Override
    public State stop() {
      return WAIT;
    }
  };

  public abstract State start();

  public abstract State stop();
}

@Getter
public class Music {
  private State state = State.WAIT;

  public void start() {
    setState(state.start());
  }

  public void stop() {
    setState(state.stop());
  }

  public void setState(State state) {
    this.state = state;
    System.out.println("状态变更为：" + state);
  }
}

public class Test {
  public static void main(String[] args) {
    Music music = new Music();
    // 状态变更为：RUNNING
    music.start();
    // 状态变更为：RUNNING
    music.start();
    // 状态变更为：WAIT
    music.stop();
    // 状态变更为：RUNNING
    music.start();
  }
}
```