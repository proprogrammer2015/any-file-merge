import { resolvePath } from 'corresponding-path';
import { deepPath } from './deepPath';
import { validateConfiguration } from './configValidation';

export class AnyFileMerge {
    constructor(
        _fileSystem,
        _configuration
    ) {
        validateConfiguration(_configuration);

        this.fs = _fileSystem;
        this.config = _configuration;
        this.filenamePlaceholder = /\[name\]/g;
    }

    combine(moduleInputPath) {
        if (!moduleInputPath) {
            throw new Error('Invalid module path was passed. Cannot combine module parts.');
        }
        const { output, processors, fileName } = this.config;
        const path = resolvePath(moduleInputPath, output);

        const modulePath = path.input.modulePath.join('/');

        const requiredModules = processors.filter(instance => instance.isRequired());
        const missingRequired = requiredModules
            .filter(instance => !this.fs.existsSync(`${modulePath}.${instance.extension()}`))
            .map(instance => instance.extension());

        if (missingRequired.length) {
            throw new Error(`These modules are required: ${missingRequired}`);
        }

        const outputData = processors
            .filter(instance => this.fs.existsSync(`${modulePath}.${instance.extension()}`))
            .map(instance => instance.transform(this.fs.readFileSync(`${modulePath}.${instance.extension()}`)))
            .join('\n');

        const dir = path.output.dir;
        deepPath(dir, '/')
            .forEach(path => {
                try {
                    this.fs.mkdirSync(path);
                } catch (error) {

                }
            });

        let outputFilenamePath = dir.join('/');
        let { name } = path.input;
        if (!name) {
            name = dir[dir.length - 1];
            outputFilenamePath = dir.slice(0, -1).join('/');
        }

        let outputFileName = `${name}${fileName}`;
        if (fileName.indexOf('.') !== 0) {
            outputFileName = `${fileName}`.replace(this.filenamePlaceholder, name);
        }

        this.fs.writeFileSync(`${outputFilenamePath}/${outputFileName}`, outputData);
    }
}