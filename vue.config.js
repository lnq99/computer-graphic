const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/computer-graphics/'
    : '/',

  productionSourceMap: false,

  chainWebpack: (config) => {
    config.externals({
      moment: 'moment',
    });
  },

  configureWebpack: () => {
    const obj = { plugins: [] };
    if (process.env.NODE_ENV === 'development') {
      obj.plugins.push(new BundleAnalyzerPlugin());
    }
    return obj;
  },
};
