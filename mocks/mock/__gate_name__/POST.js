
var responseData = require('../func/func');
var _ = require('lodash/fp');

function resolveGate(gate) {
  const [prefix, method, ...name] = gate.replace(/([A-Z])/g, '___$1').split('___')
  const config = {
    prefix,
    method,
    name: `${name}`.replace(/[\,]/g, '')
  }
  
  const isSave = (config.method == 'Save');

  return isSave? `${config.prefix}Get${config.name === 'Contract' ? 'EditableContract': config.name }` : gate;
};

function POST(request, response) { 
  response.json(responseData(request, data || null));
}

module.exports = POST;