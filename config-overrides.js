const {override,addLessLoader,addWebpackAlias  }=require("customize-cra");
const path = require('path')
const resolve = dir => path.join(__dirname, '.', dir)
module.exports = override(
    addWebpackAlias({
        ['@']:resolve("src"),
        ["components"]:resolve("src/components"),
        ["network"]:resolve("src/network"),
        ["assets"]:resolve("src/assets"),
        ["container"]:resolve("src/container"),
        ["jsutil"]:resolve("src/jsutil")
    }),
    addLessLoader({
      lessOptions: {
        strictMath: true,
        noIeCompat: true,
        loader: "css-loader",
        modules: {
          localIdentName: "[name]__[local]___[hash:base64:5]",
        }
      }
    })
)