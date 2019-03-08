import { BaseTransformation } from "./base";

export class Css extends BaseTransformation {
    constructor(ext = 'css', isRequired = false) {
        super(ext, isRequired);
    }

    transform(content) {
        return `<style>${content}</style>`;
    }
}