export function isNonNullableTuple<T extends readonly any[]>(t: T): t is T & [T[0], NonNullable<T[1]>] {
    return t[1] !== undefined
}
