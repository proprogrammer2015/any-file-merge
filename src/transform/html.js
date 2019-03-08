import { BaseTransformation } from "./base";

export class Html extends BaseTransformation {
    constructor(ext = 'html', isRequired = true) {
        super(ext, isRequired);
    }

    transform(content) {
        return content;
    }
}