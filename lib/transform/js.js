"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Js = void 0;

var _base = require("./base");

class Js extends _base.BaseTransformation {
  constructor(ext = 'js', isRequired = false) {
    super(ext, isRequired);
  }

  transform(content) {
    return `<script>${content}</script>`;
  }

}

exports.Js = Js;