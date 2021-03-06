function formatNumber(number, decimalPoints = 0) {
    if (number == undefined) return

    const factor = parseInt("1".padEnd(decimalPoints + 1, "0"))

    return round(number * factor) / factor
}

function formatTime(milliseconds) {
    if (milliseconds == undefined) return

    let seconds = floor(milliseconds / 1000)
    let minutes = floor(seconds / 60)

    milliseconds %= 1000
    seconds %= 60
    minutes %= 60

    milliseconds = milliseconds.toString().substring(0, 2).padStart(2, "0")
    seconds = seconds.toString().padStart(2, "0")
    minutes = minutes.toString().padStart(2, "0")

    return `${minutes}:${seconds}:${milliseconds}`
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

function storeHighscore(levelName, highscore) {
    levelName = normalizeLevelName(levelName)
    localStorage.setItem(`highscore-level-${levelName}`, highscore)
}

function getHighscore(levelName) {
    levelName = normalizeLevelName(levelName)
    let highscore = localStorage.getItem(`highscore-level-${levelName}`)
    return highscore ? parseInt(highscore) : null
}

function normalizeLevelName(levelName) {
    return levelName.replace(/\s/g, "-")
}

function toggleDebug() {
    if (!DEBUG) {
        DEBUG = "info"
    }
    else if (DEBUG == "info") {
        DEBUG = "full"
    }
    else {
        DEBUG = ""
    }

    localStorage.setItem("DEBUG", DEBUG)
}

function loadDebug() {
    DEBUG = localStorage.getItem("DEBUG")
}

function isInfoDebug() {
    return DEBUG == "info" || isFullDebug()
}

function isFullDebug() {
    return DEBUG == "full"
}
