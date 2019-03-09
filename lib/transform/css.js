"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Css = void 0;

var _base = require("./base");

class Css extends _base.BaseTransformation {
  constructor(ext = 'css', isRequired = false) {
    super(ext, isRequired);
  }

  transform(content) {
    return `<style>${content}</style>`;
  }

}

exports.Css = Css;