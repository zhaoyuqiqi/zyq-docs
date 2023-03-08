import { defineUserConfig, defaultTheme } from "vuepress";

export default defineUserConfig({
  lang: "zh-CN",
  title: "爱哭的赵一一",
  description: "前端个人学习站点，总结个人学习历程与经验",
  theme: defaultTheme({
    navbar: [
      { text: "主页", link: "/" },
      {
        text: "Vue",
        link: "/vue/",
      },
      {
        text: "React",
        link: "/react/",
      },
      {
        text: "奇技淫巧",
        children: [
          {
            text: "Promise",
            link: "/skill/promise/",
          },
          {
            text: "杂项",
            link: "/skill/messy/",
          },
        ],
      },
      {
        text: "算法",
        children: [
          {
            text: "二分法",
            link: "/algorithm/binnary/",
          },
          {
            text: "双指针",
            link: "/algorithm/double-pointer/",
          },
          {
            text: "动态规划",
            link: "/algorithm/dp/",
          },
          {
            text: "二叉树",
            link: "/algorithm/binnary-tree/",
          },
          {
            text: "排序算法",
            link: "/algorithm/sort/",
          },
        ],
      },
      { text: "B站主页", link: "https://space.bilibili.com/279282087" },
      {
        text: "掘金主页",
        link: "https://juejin.cn/user/3447712806348557/posts",
      },
      // 下拉列表的配置
      // {
      //   text: "Languages",
      //   children: [
      //     { text: "Chinese", link: "/language/chinese" },
      //     { text: "English", link: "/language/English" },
      //   ],
      // },
    ],
    logo: "/images/header-logo.jpg",
  }),
  base: "/zyq-docs/",
});
