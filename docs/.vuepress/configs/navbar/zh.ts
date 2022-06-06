import type { NavbarConfig } from "@vuepress/theme-default";

export const zh: NavbarConfig = [
  {
    text: "Java",
    link: "/java/basic/",
    activeMatch: "^/java/",
  },
  {
    text: "Spring",
    link: "/spring/basic/",
    activeMatch: "^/spring/",
  },
  {
    text: "系统设计",
    children: [
      {
        text: "认证授权",
        children: ["/security/spring-security/"],
      },
      {
        text: "消息队列",
        children: [
          "/message-queue/basic/",
          "/message-queue/kafka/",
          "/message-queue/rocket-mq/",
          "/message-queue/rabbit-mq/",
        ],
      },
    ],
  },
  {
    text: "关于作者",
    link: "/author/",
    activeMatch: "^/author/",
  },
];
