export function pick(object: Record<string, any>, keys: string[]): Record<string, any> {
    const newObj: Record<string, any> = {};
    for (const i in object) {
        if (object.hasOwnProperty(i) && keys.includes(i)) {
            newObj[i] = object[i];
        }
    }
    return newObj;
}
