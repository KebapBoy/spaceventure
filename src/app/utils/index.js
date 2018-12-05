function formatNumber(number, decimalPoints = 0) {
    const factor = parseInt("1".padEnd(decimalPoints + 1, "0"))

    return round(number * factor) / factor
}

function checkControl(control) {
    switch (control) {
        case "leftThrust":
            // either C is pressed or the user touches the left half of the screen
            return keyIsDown(KEYS.C) || touches.some(touch => touch.x < width / 2)

        case "rightThrust":
            // either M is pressed or the user touches the right half of the screen
            return keyIsDown(KEYS.M) || touches.some(touch => touch.x > width / 2)
    }
}
