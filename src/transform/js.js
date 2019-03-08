import { BaseTransformation } from "./base";

export class Js extends BaseTransformation {
    constructor(ext = 'js', isRequired = false) {
        super(ext, isRequired);
    }

    transform(content) {
        return `<script>${content}</script>`;
    }
}