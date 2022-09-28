const moduleExist = require('./moduleexists');

const nodePaths = {
  DEFAULT: 'no path',
  PLAIN: '../build/Release/simdjson.node'
};

let path = nodePaths.DEFAULT;
if (moduleExist(nodePaths.PLAIN)) {
  const simdjson = require(nodePaths.PLAIN);
  if (simdjson) {
    path = nodePaths.PLAIN;
  }
}

if (path === nodePaths.DEFAULT) {
  // if we can't find the previous module,
  // we use the standard JSON
  const simdjson = JSON;
  // @ts-ignore
  simdjson["isValid"] = (str: string) => {
    try {
      simdjson.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };
  module.exports = simdjson;
} else {
  module.exports = require(nodePaths.PLAIN);
}