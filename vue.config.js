module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        // modify the options...
        return options
      })

    config.module.rule('pdf')
      .test(/\.pdf$/)
      .use('file-loader').loader('file-loader')

  }
}