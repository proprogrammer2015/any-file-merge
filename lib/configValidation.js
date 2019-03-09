"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateConfiguration = void 0;
const requiredConfigurationKeys = ['output', 'fileName', 'processors'];

let validateConfiguration = config => {
  const configKeys = Object.keys(config);
  const missingOptions = requiredConfigurationKeys.filter(key => configKeys.indexOf(key) === -1);

  if (missingOptions.length) {
    throw new Error(`Following configuration keys are missing: ${missingOptions.join(', ')}`);
  }
};

exports.validateConfiguration = validateConfiguration;