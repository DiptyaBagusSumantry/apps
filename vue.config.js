const path = require("path");

module.exports = {
  publicPath: "/",
  pluginOptions: {
    webpackBundleAnalyzer: {
      analyzerMode: "static",
      openAnalyzer: false,
    },
  },
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          includePaths: ["./node_modules", "./src/assets"],
        },
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@themeConfig": path.resolve(__dirname, "themeConfig.js"),
        "@core": path.resolve(__dirname, "src/@core"),
        "@validations": path.resolve(
          __dirname,
          "src/@core/utils/validations/validations.js"
        ),
        "@axios": path.resolve(__dirname, "src/libs/axios"),
      },
    },
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
    externals(context, request, callback) {
      if (/xlsx|canvg|pdfmake/.test(request)) {
        return callback(null, `commonjs ${request}`);
      }
      return callback();
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap((options) => {
        // eslint-disable-next-line no-param-reassign
        options.transformAssetUrls = {
          img: "src",
          image: "xlink:href",
          "b-avatar": "src",
          "b-img": "src",
          "b-img-lazy": ["src", "blank-src"],
          "b-card": "img-src",
          "b-card-img": "src",
          "b-card-img-lazy": ["src", "blank-src"],
          "b-carousel-slide": "img-src",
          "b-embed": "src",
        };
        return options;
      });
  },
  transpileDependencies: ["vue-echarts", "resize-detector"],
  devServer: {
    https: false,
    proxy: {
      "/restapi": {
        target: process.env.VUE_APP_RESTAPI_URL,
        pathRewrite: { "^/restapi": "" },
        changeOrigin: true,
        secure: false,
        logLevel: "debug",
      },
      "/wasapi/": {
        target: `${process.env.VUE_APP_WAS_SITE_URL}/restapi`,
        pathRewrite: { "^/wasapi": "" },
        changeOrigin: true,
        secure: false,
        logLevel: "debug",
      },
    },
    client: {
      overlay: {
        warnings: false,
        errors: true,
      },
    },
  },
};
