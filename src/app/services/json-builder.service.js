function buildPluginData(pairsArray) {
    if (!Array.isArray(pairsArray)) {
        throw new Error('Input must be an array');
    }

    const result = {};
    pairsArray.forEach(pair => {
        if (pair.key && pair.value !== undefined) {
            result[pair.key] = pair.value;
        }
    });

    return result;
}

module.exports = { buildPluginData };
