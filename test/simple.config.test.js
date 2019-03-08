import test from 'ava';
import { Html } from '../src/transform/html';
import { Css } from '../src/transform/css';
import { Js } from '../src/transform/js';
import { AnyFileMerge } from '../src/AnyFileMerge';
import dummyFs from 'dummy-node-fs';
import { create } from './utils/fsMock';

const config = {
    output: './output',
    fileName: '.html',
    processors: [
        new Html(),
        new Js(),
        new Css()
    ]
};

test.beforeEach(t => {
    t.context.fs = create;
});

test('should combine js and html files of the module when js file was saved', t => {
    const fs = t.context.fs(dummyFs({
        './file/path/module.html': 'example html',
        './file/path/module.js': '// js content'
    }));

    const sc = new AnyFileMerge(fs, config);
    sc.combine('./file/path/module');

    const [firstCallArgs] = fs.writeFileSync.args;

    const expectedOutputPath = './output/path/module.html';
    const expectedOutputData = 'example html\n<script>// js content</script>';
    t.deepEqual(firstCallArgs, [expectedOutputPath, expectedOutputData]);
});

test('should combine js, css and html files of the module when html file was saved', t => {
    const fs = t.context.fs(dummyFs({
        './file/path/module.html': 'example html',
        './file/path/module.js': '// js content',
        './file/path/module.css': '/* css file */'
    }));

    const sc = new AnyFileMerge(fs, config);
    sc.combine('./file/path/module');

    const [firstCallArgs] = fs.writeFileSync.args;

    const expectedOutputPath = './output/path/module.html';
    const expectedOutputData = 'example html\n<script>// js content</script>\n<style>/* css file */</style>';
    t.deepEqual(firstCallArgs, [expectedOutputPath, expectedOutputData]);
});

test('should transform only html file content', t => {
    const fs = t.context.fs(dummyFs({
        './file/path/module.html': 'example html'
    }));

    const sc = new AnyFileMerge(fs, config);
    sc.combine('./file/path/module');

    const [firstCallArgs] = fs.writeFileSync.args;

    const expectedOutputPath = './output/path/module.html';
    const expectedOutputData = 'example html';
    t.deepEqual(firstCallArgs, [expectedOutputPath, expectedOutputData]);
});

test('should throw if no required module files were fonud', t => {
    const fs = t.context.fs(dummyFs({
        './file/path/module.js': '// js content'
    }));

    const sc = new AnyFileMerge(fs, config);

    const throws = () => sc.combine('./file/path/module');

    t.throws(throws, 'These modules are required: html');
});

test('should throw if nothing was passed to combine method', t => {
    const fs = t.context.fs(dummyFs({
        './file/path/module.html': 'example html',
        './file/path/module.js': '// js content'
    }));

    const sc = new AnyFileMerge(fs, config);

    const throws = () => sc.combine();

    t.throws(throws, 'Invalid module path was passed. Cannot combine module parts.');
});

test('should throw an error if invalid configuration output was passed', t => {
    const fs = t.context.fs(dummyFs({
        './file/path/module.js': '// js content',
        './file/path/module.html': 'example html'
    }));
    const config = {};
    const throws = () => {
        new AnyFileMerge(fs, config);
    }

    t.throws(throws, 'Following configuration keys are missing: output, fileName, processors');
});

test('yyyyyyyyy', t => {
    const fs = t.context.fs(dummyFs({
        './file/path/module.html': 'example html'
    }));

    const sc = new AnyFileMerge(fs, config);
    sc.combine('./file/path/module');

    const [firstCallArgs] = fs.writeFileSync.args;

    const expectedOutputPath = './output/path/module.html';
    const expectedOutputData = 'example html';
    t.deepEqual(firstCallArgs, [expectedOutputPath, expectedOutputData]);
});
