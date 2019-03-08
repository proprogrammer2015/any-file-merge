export class BaseTransformation {
    constructor(
        extension,
        isRequired
    ) {
        if (extension.indexOf('.') === 0) {
            throw new Error('Error: File extension cannot contain "." in front of extension.');
        }
        this._extension = extension;
        this._isRequired = isRequired;
    }

    isRequired() {
        return this._isRequired;
    }

    extension() {
        return this._extension;
    }

    transform(content) {
        return content;
    }
}