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
    text: "开源项目",
    children: ["/kafka/", { text: "Uni App", link: "/uni-app/package/" }],
  },
  {
    text: "关于作者",
    link: "/author/",
    activeMatch: "^/author/",
  },
];
