import test from 'ava';
import { Html } from '../src/transform/html';
import { Css } from '../src/transform/css';
import { Js } from '../src/transform/js';
import { AnyFileMerge } from '../src/AnyFileMerge';
import { BaseTransformation } from '../src/transform/base';
import dummyFs from 'dummy-node-fs';
import { create } from './utils/fsMock';
import { TypeScript } from './utils/TypeScriptProcessor';
import { Sass } from './utils/SassProcessor';

const TsService = {
    compile: content => `[ts]${content}[/ts]`
};
const SassService = {
    compile: content => `[sass]${content}[/sass]`
};

test.beforeEach(t => {
    t.context.fs = create;
});

test('should throw if one of required modules is missing', t => {
    const config = {
        output: './output',
        fileName: '.html',
        processors: [
            new Html(),
            new TypeScript(TsService)
        ]
    };
    const fs = t.context.fs(dummyFs({
        './file/path/module.html': 'html content',
    }));

    const sc = new AnyFileMerge(fs, config);

    const throws = () => sc.combine('./file/path/module');

    t.throws(throws, 'These modules are required: ts');
});

test('should combine module using custom processors', t => {
    const config = {
        output: './output',
        fileName: '.html',
        processors: [
            new Html(),
            new TypeScript(TsService),
            new Sass(SassService)
        ]
    };

    const html = 'html content';
    const ts = '// ts content';
    const sass = '/* sass */';

    const fs = t.context.fs(dummyFs({
        './file/path/module.html': html,
        './file/path/module.ts': ts,
        './file/path/module.scss': sass
    }));

    const sc = new AnyFileMerge(fs, config);
    sc.combine('./file/path/module');

    const [firstCallArgs] = fs.writeFileSync.args;

    const expectedOutputPath = './output/path/module.html';
    const expectedOutputData = `${html}\n<script>[ts]${ts}[/ts]</script>\n<style>[sass]${sass}[/sass]</style>`;
    t.deepEqual(firstCallArgs, [expectedOutputPath, expectedOutputData]);
});

test('should save file with given output extension', t => {
    const fs = t.context.fs(dummyFs({
        './file/path/module.js': '// js content',
        './file/path/module.html': 'example html'
    }));
    const config = {
        output: './output',
        fileName: '.svelte',
        processors: [
            new Html(),
            new Js(),
            new Css()
        ]
    };
    const sc = new AnyFileMerge(fs, config);

    sc.combine('./file/path/module');

    const [firstCallArgs] = fs.writeFileSync.args;

    const expectedOutputPath = './output/path/module.svelte';
    const expectedOutputData = 'example html\n<script>// js content</script>';

    t.deepEqual(firstCallArgs, [expectedOutputPath, expectedOutputData]);
});

test('should generate file name based on extended name', t => {
    const fs = t.context.fs(dummyFs({
        './file/path/module.js': '// js content',
        './file/path/module.html': 'example html'
    }));
    const config = {
        output: './output',
        fileName: 'some-[name]-name.svelte',
        processors: [
            new Html(),
            new Js(),
            new Css()
        ]
    };
    const sc = new AnyFileMerge(fs, config);

    sc.combine('./file/path/module');

    const [firstCallArgs] = fs.writeFileSync.args;

    const expectedOutputPath = './output/path/some-module-name.svelte';
    const expectedOutputData = 'example html\n<script>// js content</script>';

    t.deepEqual(firstCallArgs, [expectedOutputPath, expectedOutputData]);
});

test('should merge js and html files and save using multiple filename pattern', t => {
    const fs = t.context.fs(dummyFs({
        './file/path/module.html': 'example html',
        './file/path/module.js': '// js content'
    }));

    const config = {
        output: './output',
        fileName: 'merged-[name]-[name].html',
        processors: [
            new Html(),
            new Js(),
            new Css()
        ]
    };
    const sc = new AnyFileMerge(fs, config);
    sc.combine('./file/path/module');

    const [firstCallArgs] = fs.writeFileSync.args;

    const expectedOutputPath = './output/path/merged-module-module.html';
    const expectedOutputData = 'example html\n<script>// js content</script>';
    t.deepEqual(firstCallArgs, [expectedOutputPath, expectedOutputData]);
});

// test('should merge module using filename and save using multiple filename pattern', t => {
//     const fs = t.context.fs(dummyFs({
//         './file/path/module.html': 'example html',
//         './file/path/module.js': '// js content'
//     }));

//     const config = {
//         output: './output',
//         fileName: 'merged-[name]-[name].html',
//         processors: [
//             new Html(),
//             new Js(),
//             new Css()
//         ]
//     };
//     const sc = new AnyFileMerge(fs, config);
//     sc.combine('./file/path/module.html');

//     const [firstCallArgs] = fs.writeFileSync.args;

//     const expectedOutputPath = './output/path/merged-module-module.html';
//     const expectedOutputData = 'example html\n<script>// js content</script>';
//     t.deepEqual(firstCallArgs, [expectedOutputPath, expectedOutputData]);
// });
// test('should return module string if outputString is true', t => {

// });

// test('should return module object with properties based on extension type if outputObject is true', t => {

// });