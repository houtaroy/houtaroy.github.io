import { defineUserConfig } from "vuepress";
import type { DefaultThemeOptions } from "vuepress";
import { searchPlugin } from "@vuepress/plugin-search";

export default defineUserConfig<DefaultThemeOptions>({
  locales: {
    "/": {
      lang: "zh-CN",
      title: "桉树",
      description: "考拉的粮食",
    },
  },
  themeConfig: {
    logo: "https://vuejs.org/images/logo.png",
  },
  plugins: [
    searchPlugin({
      locales: {
        "/": {
          placeholder: "搜索",
        },
      },
    }),
  ],
});
