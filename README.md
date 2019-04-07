# Installation
```js
npm install any-file-merge
```

# Usage 
## predefined processors
```js
const fs = require('fs');
const { AnyFileMerge, Html, Js, Css } = require('any-file-merge');
const config = {
    output: './output',
    fileName: 'merged-[name].html',
    processors: [
        new Html(),
        new Js(),
        new Css()
    ]
};
const sc = new AnyFileMerge(fs, config);
// Creates ./output/path/merged-module-module.html file
sc.combine('./file/path/module');
```

## custom processors
custom.ts.processor.js
```js
import { BaseTransformation } from '../../src/transform/base';

export class TypeScript extends BaseTransformation {
    constructor(tsService) {
        super('ts', true);
        this._tsService = tsService;
    }

    transform(content) {
        return `<script>${this._tsService.compile(content)}</script>`;
    }
}
```
usage
```js
const fs = require('fs');
const TypeScript = require('custom.ts.processor');
const tsService = require('ts-service');
const { AnyFileMerge, Html, Js, Css } = require('any-file-merge');
const config = {
    output: './output',
    fileName: 'merged-[name].html',
    processors: [
        new Html(),
        new TypeScript(tsService),
        new Css()
    ]
};
const sc = new AnyFileMerge(fs, config);
// Creates ./output/path/merged-module-module.html file
sc.combine('./file/path/module');
```