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

export function deepMerge(target, source) {
    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            if (Array.isArray(source[key])) {
                // Replace arrays completely
                target[key] = source[key];
            } else if (
                source[key] !== null &&
                typeof source[key] === "object"
            ) {
                // If the target does not have this key, initialize it as an object
                if (!target[key] || typeof target[key] !== "object") {
                    target[key] = {};
                }
                // Recursively merge nested objects
                deepMerge(target[key], source[key]);
            } else {
                // For primitive types, directly assign the value
                target[key] = source[key];
            }
        }
    }
}
