export let deepPath = (elements, separator) => {
    return elements.map((item, index) => elements.slice(0, index + 1).join(separator));
};