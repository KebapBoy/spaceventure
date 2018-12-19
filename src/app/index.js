const levels = []
let currentLevel

let player

let error

let appFont

/**
 * Called by p5 at before game start (before setup).
 * Load game data.
 */
function preload() {
    loadGameData()
}

/**
 * Called by p5 at game start after all game data is completly loaded.
 * Initialize the game.
 */
function setup() {
    // sort levels by id in ascending order
    levels.sort((a, b) => a.id - b.id)

    // the canvas should fill the browser viewport
    const renderer = createCanvas(windowWidth, windowHeight)

    // always work with degree angles
    angleMode(DEGREES)

    // hide mouse cursor
    noCursor()

    textFont(appFont)

    // prevent contextmenu on mouse right click
    renderer.canvas.addEventListener("contextmenu", e => e.preventDefault())

    // resize canvas on browser resize
    window.addEventListener("resize", () => resizeCanvas(windowWidth, windowHeight))

    // initialize DEBUG variable
    DEBUG = setOrGetDebug()

    // toggle DEBUG
    document.addEventListener("keypress", e => {
        if (e.keyCode == KEYS.D && e.shiftKey) {
            DEBUG = setOrGetDebug(!DEBUG)
        }
    })

    player = new Spaceship()
    player.friction = 0.01
    player.flexibility = 0.5

    initializeLevel()
}

function loadGameData() {
    let dataFolder = "./data"
    let levelsFolder = `${dataFolder}/levels`

    // load font
    appFont = loadFont('./fonts/abel.ttf')

    // load levels
    loadJSON(`${levelsFolder}/levels.json`, levelFiles => {
        if (!Array.isArray(levelFiles) || !levelFiles.length) {
            error = {
                title: "Die Level-Datei ist fehlerhaft.",
                message: "Bitte stelle sicher, dass die Datei unbeschädigt ist und starte das Spiel neu."
            }
            return
        }

        // load level files
        for (const file of levelFiles) {
            const url = `${levelsFolder}/${file}`

            loadJSON(url, levelData => {
                if (levelData) {
                    const level = new Level(levelData)

                    if (level.valid) {
                        levels.push(level)
                        return
                    }
                }

                console.error(`Ein Level ist nicht verfügbar, da die Level-Datei '${url}' fehlerhaft ist.`)
            })
        }
    })
}

/**
 * Initialized the current level.
 *
 * Either the first level on game start or the next level on level finish.
 */
function initializeLevel() {
    // if no level is currently active ...
    if (!currentLevel) {
        // ... load the first ...
        currentLevel = levels[0]
    }
    else {
        // ... else load the next
        currentLevel = levels[levels.indexOf(currentLevel) + 1]
    }

    if (!currentLevel) {
        // No level left -> Game finished
        finishGame()
        return
    }

    // set spaceship start position
    player.startPosition = currentLevel.start.position.copy()
    player.reset()

    currentLevel.reset(true)
}

/**
 * Resets the current level to the initial state.
 *
 * The players position, all switches and all lasers will be resetted.
 */
function resetLevel(resetTime) {
    // reset player
    player.reset()

    // reset level
    currentLevel.reset(resetTime)
}

/**
 * Finishes the current level and shows an endscreen for a few seconds
 * before loading the next level.
 */
function finishLevel() {
    const time = Date.now() - currentLevel.startTime

    storeHighscore(currentLevel.id, time)
    currentLevel.finished = true

    push()

    // curtain
    fill(0, 0, 0, 150)
    rectMode(CORNER)
    rect(0, 0, width, height)

    noStroke()
    fill(255)

    // text
    push()
    textSize(72)
    textAlign(CENTER, BOTTOM)
    textStyle(BOLD)
    text("Level geschafft!", width / 2, height / 2 - 72)
    pop()

    // time
    push()
    textSize(32)
    textAlign(CENTER, TOP)
    let label = (!currentLevel.highscore || time < currentLevel.highscore) ? "Neue Bestzeit" : "Deine Zeit"
    text(`${label}: ${formatTime(time)}`, width / 2, height / 2 + 32)
    pop()

    pop()

    // resume game after 3 seconds
    setTimeout(() => {
        initializeLevel()
    }, 3000)
}

/**
 * Finishes the game and shows an endscreen for a few seconds
 * before reloading the first level.
 */
function finishGame() {
    push()

    // curtain
    fill(0)
    rectMode(CORNER)
    rect(0, 0, width, height)

    noStroke()
    fill(255)

    // text
    push()
    textSize(72)
    textAlign(CENTER, BOTTOM)
    textStyle(BOLD)
    text("Herzlichen Glückwunsch!", width / 2, height / 2 - 72)
    pop()

    // message
    push()
    textSize(32)
    textAlign(CENTER, TOP)
    text("Du hast erfolgreich alle Level von Spaceventure absolviert. Das Spiel startet nun von vorne.\nVersuche doch deine bisherigen Bestzeiten zu knacken.", 50, height / 2 + 32, width - 100)
    pop()

    // resume game after 3 seconds
    setTimeout(() => {
        initializeLevel()
    }, 5000)
}

/**
 * Called by p5 every frame.
 * The game loop.
 */
function draw() {
    if (error) {
        showError()
        return
    }

    // wait for level to load
    if (!currentLevel || !currentLevel.initialized) return

    // wait for level end screen to finish
    if (currentLevel.finished) return

    const redrawCanvas = update()

    if (redrawCanvas) {
        show()

        showHud()

        if (DEBUG) {
            showDebugInfo()
        }
    }
}

/**
 * Does all the needed update logic each frame.
 *
 * * Checks if the user wants to restart the level
 * * Updated the players position
 * * Handles collision detection
 * * Checks if the finish is reached
 *
 * Returns a boolean which indicated if the canvas should be redrawn or not
 */
function update() {
    player.update()

    let landed = false

    for (const platform of currentLevel.platforms) {
        const collisionSide = platform.detectCollison(player)

        if (!collisionSide) {
            // no collision happened
            continue
        }

        if (!platform.landable) {
            // hit a not landable object
            resetLevel()
            return
        }

        // bounce of landable object
        if (collisionSide == "bottom" || collisionSide == "top") {
            if (collisionSide == "bottom") {
                // bounce of from platforms top side -> landed on object
                landed = true
                let objectPosition = platform.getPosition("top")
                player.position.y = objectPosition.y - (player.height / 2)
            }
            else {
                // bounce of from platforms bottom side
                let objectPosition = platform.getPosition("bottom")
                player.position.y = objectPosition.y + (player.height / 2)
            }

            player.velocity.y *= -player.flexibility
            player.velocity.x *= player.flexibility
        }
        else {
            if (collisionSide == "left") {
                // bounce of from platforms right side
                let objectPosition = platform.getPosition("right")
                player.position.x = objectPosition.x + (player.width / 2)
            }
            else {
                // bounce of from platforms left side
                let objectPosition = platform.getPosition("left")
                player.position.x = objectPosition.x - (player.width / 2)
            }

            player.velocity.x *= -player.flexibility
        }
    }

    for (const _switch of currentLevel.switches) {
        const collisionSide = _switch.detectCollison(player)

        if (collisionSide == "right") {
            _switch.activate()
        }
        else if (collisionSide == "left") {
            _switch.deactivate()
        }
    }

    for (const laser of currentLevel.lasers) {
        const collided = laser.detectCollison(player)

        if (collided) {
            // hit a laser
            resetLevel()
            return
        }
    }

    if (!landed) {
        // add gravity
        player.addForce(0.15, 90)
    }

    const finishReached = currentLevel.finish.detectCollison(player)

    if (finishReached) {
        finishLevel()
        return
    }

    return true
}

/**
 * Redraws the canvas with the updated data each frame.
 */
function show() {
    // clear old frame
    background(0)

    push()

    // translate to player position to show the spaceship in the middle of the screen
    translate(-player.position.x + width / 2, -player.position.y + height / 2)

    // show all objects of the current level
    currentLevel.show()

    // the player should overlap all other objects
    player.show()

    pop()
}

function showHud() {
    push()

    noStroke()
    fill(255)
    textSize(36)

    // current time
    textAlign(LEFT, TOP)
    text(formatTime(Date.now() - currentLevel.startTime), 25, 25)

    // level name
    textAlign(RIGHT, TOP)
    text(currentLevel.name.toUpperCase(), width - 25, 25)

    textSize(22)

    // level id
    text(`LEVEL ${currentLevel.id}`, width - 25, 70)

    textAlign(LEFT, TOP)
    text(formatTime(currentLevel.highscore) || "00:00:00", 26, 70)

    pop()
}

let fps = 60
function showDebugInfo() {
    // calculate fps (update var every once/twice a second)
    if (frameCount % 30 == 0) {
        fps = parseInt(frameRate())
    }

    push()

    translate(width - 200, height - 125)

    // frame
    push()
    stroke(255, 0, 0)
    noFill()
    rect(0, 0, 175, 100)
    pop()

    // title
    push()
    noStroke()
    fill(255, 0, 0)
    textStyle(BOLD)
    text("DEBUG Information", 5, 17)
    pop()

    // fps
    push()
    noStroke()
    fill(255, 0, 0)
    textStyle(BOLD)
    textSize(20)
    text(fps, 150, 20)
    pop()

    // player information
    push()
    noStroke()
    fill(255)
    // position
    text("x-Position:  " + formatNumber(player.position.x, 2), 7, 35)
    text("y-Position:  " + formatNumber(player.position.y, 2), 7, 50)
    // velocity
    text("x-Velocity:  " + formatNumber(player.velocity.x, 2), 7, 65)
    text("y-Velocity:  " + formatNumber(player.velocity.y, 2), 7, 80)
    pop()

    pop()
}

function showError() {
    push()

    // curtain
    fill(0, 0, 0, 150)
    rectMode(CORNER)
    rect(0, 0, width, height)

    // headline
    noStroke()
    fill(255, 0, 0)
    textSize(56)
    textAlign(CENTER, BOTTOM)
    textStyle(BOLD)
    text("Fehler", 50, height / 2 - 192, width - 100)

    // title
    noStroke()
    fill(255)
    textSize(48)
    textAlign(CENTER, BOTTOM)
    textStyle(BOLD)
    text(error.title, 50, height / 2 - 96, width - 100)

    // message
    noStroke()
    fill(255)
    textSize(32)
    textAlign(CENTER, TOP)
    textStyle(NORMAL)
    text(error.message, 50, height / 2 + 32, width - 100)

    pop()
}

/**
 * Called by p5 when any key is pressed.
 */
function keyPressed() {
    switch (keyCode) {
        case KEYS.R:
            // reset level if user presses the key R
            resetLevel(true)
            break
    }
}
