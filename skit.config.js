const root = process.cwd()
const path = require('path')
const utils = require('skitpack/utils')

let pathConfig = {
  root, // 根目录
  src: path.resolve(root, './src'),
  pages: path.resolve(root, './src/pages'),
  prepack: path.resolve(root, './.skit/.temp/prepack')
}

const entry = utils.createEntry(pathConfig.src, pathConfig.prepack)
const alias = utils.createAlias(pathConfig.src)

module.exports = {
  path: {},
  dev: {
    preentry: ['global'],
    staticPath: path.resolve(root, './.skit/.temp/dll')
  },
  conf: {
    target: 'web',
    entryExtra: { global: path.resolve(pathConfig.src, './global.js') },
    entry: entry,
    alias: alias,
    html: {
      title: 'Yang Test',
      favicon: path.resolve(root, './favicon.ico'),
      chunks: ['global']
    },
    publicPath: './'
  },
  dll: {
    entry: {
      vendor: ['vue']
    }
  },
  utils: {
    type2Color: {}
  }
}
