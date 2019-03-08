const requiredConfigurationKeys = [
    'output',
    'fileName',
    'processors'
];

export let validateConfiguration = config => {
    const configKeys = Object.keys(config);
    const missingOptions = requiredConfigurationKeys.filter(key => configKeys.indexOf(key) === -1);
    if (missingOptions.length) {
        throw new Error(`Following configuration keys are missing: ${missingOptions.join(', ')}`);
    }
}