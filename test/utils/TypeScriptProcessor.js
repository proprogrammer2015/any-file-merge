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