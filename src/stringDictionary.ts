export interface StringDictionary {
    [key: string]: string;
}

export function createDictionary(
    keys: string[],
    values: string[],
): StringDictionary {
    if (keys.length !== values.length) {
        throw new Error("Keys and values arrays must be of the same length");
    }

    const dictionary: StringDictionary = {};

    for (let i = 0; i < keys.length; i++) {
        dictionary[keys[i]] = values[i];
    }

    return dictionary;
}
