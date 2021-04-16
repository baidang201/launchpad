export function padArrayStart(arr, len, padding) {
    if (arr.length >= len) {
        return arr
    }
    return Array(len - arr.length).fill(padding).concat(arr)
}

export function averageEvery(arr, n) {
    if (!arr || !n) {
        return []
    }
    const groups = []
    while (arr.length) {
        groups.push(arr.splice(0, n))
    }

    return groups.map(
        group =>
            Math.round(group.reduce(
                (a, b) => a + b
            ) / group.length)
    )
}

export function sumEvery(arr, n) {
    if (!arr || !n) {
        return []
    }
    const groups = []
    while (arr.length) {
        groups.push(arr.splice(0, n))
    }

    return groups.map(
        group =>
            Math.round(group.reduce(
                (a, b) => a + b
            ))
    )
}
