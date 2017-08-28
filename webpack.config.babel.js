import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'

const IS_E2E = process.env.NODE_ENV === 'e2e'

const entry = {
  app: './src/index.js'
}
if (IS_E2E) {
  entry['e2e/swLoader'] = './e2e/swLoader.js'
}

export default {
  entry,
  output: {
    filename: '[name].js',
    path: __dirname + '/dist/',
  },
  resolve: {
    alias: {
      npm: `${__dirname}/node_modules`,
    },
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: [/node_modules/],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/network-request.html',
      inject: 'head',
      chunks: IS_E2E && ['e2e/swLoader'],
    }),
    new webpack.DefinePlugin({
      COMPILED: true,
      __OFFLINE__: process.env.NODE_ENV === 'offline',
    }),
  ],
  devServer: {
    https: IS_E2E,
    setup: function(app) {
      app.get('/euro.json', function(req, res) {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Headers', 'X-Requested-With');
        setTimeout(function() {
          res.end(
            JSON.stringify({
              time: {
                updated: 'Aug 27, 2017 08:52:00 UTC',
                updatedISO: '2017-08-27T08:52:00+00:00',
                updateduk: 'Aug 27, 2017 at 09:52 BST',
              },
              disclaimer:
                'This data was produced from the CoinDesk Bitcoin Price Index (USD). Non-USD currency data converted using hourly conversion rate from openexchangerates.org',
              bpi: {
                USD: {
                  code: 'USD',
                  rate: '4,386.2625',
                  description: 'United States Dollar',
                  rate_float: 4386.2625,
                },
                EUR: {
                  code: 'EUR',
                  rate: '3,678.0522',
                  description: 'Euro',
                  rate_float: 3678.0522,
                },
              },
            }),
          )
        }, 1000)
      })
    },
    contentBase: ['dist/'],
    host: '0.0.0.0',
  },
}
