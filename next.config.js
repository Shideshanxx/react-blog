const withLess = require("@zeit/next-less");
const WithCss = require("@zeit/next-css");
const lessToJS = require("less-vars-to-js");
const fs = require("fs");
const path = require("path");

const isProd = process.env.NODE_ENV === "production";

//主题配置  全局注入
const themeVariables = lessToJS(
  fs.readFileSync(
    path.resolve(__dirname, "./public/style/modifyVars.less"),
    "utf8"
  )
);

// fix: prevents error when .less files are required by node
if (typeof require !== "undefined") {
  require.extensions[".less"] = (file) => {};
}

module.exports = withLess(
  WithCss({
    lessLoaderOptions: {
      javascriptEnabled: true,
      modifyVars: themeVariables,
      localIdentName: "[local]___[hash:base64:5]",
    },
    distDir: "build",
    generateEtags: false,
    generateBuildId: async () => {
      return "blog-build"; // 'build-' + Date.now(); 这样会生成多个不一样的build文件可以当版本用 ，但是我不想要，影响我脚本上传七牛了， 我就要一个，写死
    },
    // assetPrefix: isProd ? 'http://cdn.zjutshideshan.cn' : '', // build后静态文件加上前缀
    assetPrefix: "",
    pageExtensions: ["jsx", "js", "ts", "tsx"],
    // 能够在页面上经过 process.env.key 获取 value。跟webpack.DefinePlugin实现的一致
    env: {
      version: "4.0",
    },

    // 下面两个要经过 'next/config' 来读取
    // 只有在服务端渲染时才会获取的配置
    serverRuntimeConfig: {
      mySecret: "secret",
      secondSecret: process.env.SECOND_SECRET,
    },
    // 在服务端渲染和客户端渲染均可获取的配置
    publicRuntimeConfig: {
      staticFolder: "/static",
    },
    // 上面这两个配置在组件里使用方式以下：
    // import getCofnig from 'next/config'
    // const { serverRuntimeConfig,publicRuntimeConfig } = getCofnig()
    // console.log( serverRuntimeConfig,publicRuntimeConfig )

    webpack: (config) => {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": path.resolve(__dirname),
        components: path.resolve(__dirname, "components"),
      };

      return config;
    },
  })
);
