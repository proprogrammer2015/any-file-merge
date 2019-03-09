"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deepPath = void 0;

let deepPath = (elements, separator) => {
  return elements.map((item, index) => elements.slice(0, index + 1).join(separator));
};

exports.deepPath = deepPath;