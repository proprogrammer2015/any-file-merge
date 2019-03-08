import { BaseTransformation } from '../../src/transform/base';

export class Sass extends BaseTransformation {
    constructor(sassService) {
        super('scss', false);
        this._sassService = sassService;
    }

    transform(content) {
        return `<style>${this._sassService.compile(content)}</style>`;
    }
}