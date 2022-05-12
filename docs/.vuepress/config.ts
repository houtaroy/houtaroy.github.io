import { defineUserConfig } from "vuepress";
import { defaultTheme } from "@vuepress/theme-default";
import { searchPlugin } from "@vuepress/plugin-search";

import { navbar, sidebar } from "./configs";

export default defineUserConfig({
  locales: {
    "/": {
      lang: "zh-CN",
      title: "桉树",
      description: "考拉的粮食",
    },
  },
  theme: defaultTheme({
    logo: "https://vuejs.org/images/logo.png",
    locales: {
      "/": {
        navbar: navbar.zh,
        sidebar: sidebar.zh,
        lastUpdatedText: "更新时间",
        contributorsText: "贡献者",
        tip: "提示",
        warning: "警告",
        danger: "危险",
        notFound: ["页面不存在"],
        backToHome: "返回首页",
      },
    },
  }),
  plugins: [
    {
      name: "'@vuepress/medium-zoom'",
    },
    searchPlugin({
      locales: {
        "/": {
          placeholder: "搜索",
        },
      },
    }),
  ],
});
