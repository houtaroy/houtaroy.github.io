import type { SidebarConfig } from "@vuepress/theme-default";

export const zh: SidebarConfig = {
  "/java/": [
    "/java/basic/README.md",
    "/java/standard-library/README.md",
    {
      text: "实用技巧",
      collapsible: true,
      children: [
        "/java/skills/calculate.md",
        "/java/skills/byte.md",
        "/java/skills/string.md",
        "/java/skills/enum.md",
        "/java/skills/collection.md",
        "/java/skills/map.md",
      ],
    },
  ],
  "/spring/": [
    "/spring/basic/README.md",
    {
      text: "实用技巧",
      collapsible: true,
      children: ["/spring/skills/controller.md"],
    },
  ],
  "/uni-app/": ["/uni-app/package/"],
  "/message-queue/": [
    "/message-queue/basic/",
    "/message-queue/kafka/",
    "/message-queue/rocket-mq/",
    "/message-queue/rabbit-mq/",
  ],
  "/author/": ["/author/README.md"],
};
