function formatNumber(number, decimalPoints = 0) {
    const factor = parseInt("1".padEnd(decimalPoints + 1, "0"))

    return round(number * factor) / factor
}
