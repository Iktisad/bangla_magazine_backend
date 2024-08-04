export function removeKeys(obj, keysToRemove) {
    if (!Array.isArray(keysToRemove)) {
        throw new Error("keysToRemove should be an array of keys.");
    }

    function removeKeysRecursive(currentObj) {
        if (Array.isArray(currentObj)) {
            return currentObj.map(removeKeysRecursive);
        } else if (typeof currentObj === "object" && currentObj !== null) {
            return Object.keys(currentObj).reduce((acc, key) => {
                if (!keysToRemove.includes(key)) {
                    acc[key] = removeKeysRecursive(currentObj[key]);
                }
                return acc;
            }, {});
        }
        return currentObj;
    }

    return removeKeysRecursive(obj);
}
