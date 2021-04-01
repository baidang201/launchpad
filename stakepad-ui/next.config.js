const withCSS = require('@zeit/next-css')
const withLess = require('@zeit/next-less')
const withSass = require("@zeit/next-sass");

module.exports = withCSS({
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[local]___[hash:base64:5]",
  },
  ...withLess(
    withSass({
      lessLoaderOptions: {
        javascriptEnabled: true,
      },

      webpack: (config, { isServer }) => {
        if (isServer) {
          const antStyles = /antd\/.*?\/style.*?/
          const origExternals = [...config.externals]
          config.externals = [
            (context, request, callback) => {
              if (request.match(antStyles)) return callback()
              if (typeof origExternals[0] === 'function') {
                origExternals[0](context, request, callback)
              } else {
                callback()
              }
            },
            ...(typeof origExternals[0] === 'function' ? [] : origExternals),
          ]
      
          config.module.rules.unshift({
            test: antStyles,
            use: 'null-loader',
          })
        }
        return config
      },
    })
  ),
});

