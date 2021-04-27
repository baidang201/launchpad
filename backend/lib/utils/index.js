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

export function winningRate({ score = 200, stake = 1000, miners = 500, avgScore = 420, avgStake = 1000, myMiners = 1 }) {
    const n = 5
    const weight = w(score, stake)
    const otherWeight = w(avgScore, avgStake)
    return p(weight, myMiners, otherWeight, miners, 1, n - myMiners)
}

function w(score, stake) {
    return score + Math.sqrt(stake) * 5
}

function p(a, m, b, n, x, y) {
    if (x === 0 && y === 0) return 1
    if (m === 0 || n === 0) return 1
    const sigma = a * m + b * n
    return (
        (x > 0 ? (a * m / sigma) * p(a, m - 1, b, n, x - 1, y) : 0) +
    (y > 0 ? (b * n / sigma) * p(a, m, b, n - 1, x, y - 1) : 0)
    )
}