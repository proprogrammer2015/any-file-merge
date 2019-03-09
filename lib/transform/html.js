"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Html = void 0;

var _base = require("./base");

class Html extends _base.BaseTransformation {
  constructor(ext = 'html', isRequired = true) {
    super(ext, isRequired);
  }

  transform(content) {
    return content;
  }

}

exports.Html = Html;