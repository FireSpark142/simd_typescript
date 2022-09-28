const simdjson = require('./lib/simdjsontarget');
const benchmark = require('./benchmark/benchmark')
const validator = require('./benchmark/is_valid')

module.exports = {simdjson, benchmark, validator};
