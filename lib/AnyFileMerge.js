"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnyFileMerge = void 0;

var _correspondingPath = require("corresponding-path");

var _deepPath = require("./deepPath");

var _configValidation = require("./configValidation");

class AnyFileMerge {
  constructor(_fileSystem, _configuration) {
    (0, _configValidation.validateConfiguration)(_configuration);
    this.fs = _fileSystem;
    this.config = _configuration;
    this.filenamePlaceholder = /\[name\]/g;
  }

  combine(moduleInputPath) {
    if (!moduleInputPath) {
      throw new Error('Invalid module path was passed. Cannot combine module parts.');
    }

    const {
      output,
      processors,
      fileName
    } = this.config;
    const path = (0, _correspondingPath.resolvePath)(moduleInputPath, output);
    const modulePath = path.input.modulePath.join('/');
    const requiredModules = processors.filter(instance => instance.isRequired());
    const missingRequired = requiredModules.filter(instance => !this.fs.existsSync(`${modulePath}.${instance.extension()}`)).map(instance => instance.extension());

    if (missingRequired.length) {
      throw new Error(`These modules are required: ${missingRequired}`);
    }

    const outputData = processors.filter(instance => this.fs.existsSync(`${modulePath}.${instance.extension()}`)).map(instance => instance.transform(this.fs.readFileSync(`${modulePath}.${instance.extension()}`))).join('\n');
    const dir = path.output.dir;
    (0, _deepPath.deepPath)(dir, '/').forEach(path => {
      try {
        this.fs.mkdirSync(path);
      } catch (error) {}
    });
    let outputFilenamePath = dir;
    let {
      name
    } = path.input;

    if (!name) {
      name = dir[dir.length - 1];
      outputFilenamePath = dir.slice(0, -1);
    }

    let outputFileName = `${name}${fileName}`;

    if (fileName.indexOf('.') !== 0) {
      outputFileName = `${fileName}`.replace(this.filenamePlaceholder, name);
    }

    this.fs.writeFileSync(`${outputFilenamePath.join('/')}/${outputFileName}`, outputData);
  }

}

exports.AnyFileMerge = AnyFileMerge;