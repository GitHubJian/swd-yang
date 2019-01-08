const root = process.cwd()
const path = require('path')

module.exports = {
  path: {
    static: path.resolve(root, './.skit/dist'),
    favicon: path.resolve(root, './.skit/dist/favicon.ico')
  }
}
