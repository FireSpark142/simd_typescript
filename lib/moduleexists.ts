function moduleExists(modulePath: string) {
    try {
      return !!require.resolve(modulePath)
    } catch (e) {
      return false
    }
  }
  module.exports = moduleExists;