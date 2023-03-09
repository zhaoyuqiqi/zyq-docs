import { defineUserConfig, defaultTheme } from "vuepress";
import { searchPlugin } from "@vuepress/plugin-search";
const baseAddress = "/zyq-docs/";
export default defineUserConfig({
  lang: "zh-CN",
  title: "爱哭的赵一一",
  description:
    "爱哭的赵一一前端个人学习站点，总结个人学习历程与经验，介绍两大框架React、Vue和各类常见算法（排序算法、最长递增子序列、优先队列）等等。以及前端开发中的奇技淫巧，帮助你提升自身能力获取高薪工作",
  head: [
    ["link", { rel: "icon", href: `${baseAddress}images/header-logo.jpg` }],
  ],
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
          {
            text: "堆",
            link: "/algorithm/heap/",
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
    notFound: ["页面找不到啦~  去首页看看吧!"],
    backToHome: "返回首页",
  }),
  base: baseAddress,
  plugins: [searchPlugin()],
});
