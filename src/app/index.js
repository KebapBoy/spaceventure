let gameFont
let gameScale
let scaledWidth
let scaledHeight
const cameraOffset = { x: 0, y: 0 }

let error

let levels = []
let currentLevel
let player

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
    // remove invalid levels
    levels = levels.filter(x => x)

    // the canvas should fill the browser viewport
    const renderer = createCanvas(windowWidth, windowHeight)

    calculateGameScale()

    // always work with degree angles
    angleMode(DEGREES)

    // hide mouse cursor
    noCursor()

    // set game font as default
    textFont(gameFont)

    // prevent contextmenu on mouse right click
    renderer.canvas.addEventListener("contextmenu", e => e.preventDefault())

    // resize canvas on browser resize
    window.addEventListener("resize", () => {
        resizeCanvas(windowWidth, windowHeight)
        calculateGameScale() // game scale depends on screen size, therefore recalculate it
    })

    // initialize DEBUG variable
    loadDebug()

    // toggle DEBUG
    document.addEventListener("keypress", e => {
        if (e.keyCode == KEYS.D && e.shiftKey) {
            toggleDebug()
        }
    })

    // create player and set its physics values
    player = new Spaceship()
    player.friction = 0.01
    player.flexibility = 0.5

    initializeLevel()
}

// added device shake as debug toggle on mobile
let shakeTimeoutId
function deviceShaken() {
    // use timeout to only call toggleDebug once
    // the deviceShaken function is called multiple times for one shake
    clearTimeout(shakeTimeoutId)
    shakeTimeoutId = setTimeout(() => toggleDebug(), 100)
}

/**
 * Calculates the scale needed to display the game always the same scale
 * regardless the device screen dimension.
 */
function calculateGameScale() {
    // original game scale was fitted for an 1920x1080px display
    const referenceScreenWidth = 1920

    gameScale = 1 / (referenceScreenWidth / windowWidth)

    // on mobile the game scales to small, so increase it a little bit
    if (gameScale < 0.5) {
        gameScale *= 1.5
    }

    // set scaled width and height to use them for object positioning
    scaledWidth = width / gameScale
    scaledHeight = height / gameScale
}

function loadGameData() {
    let dataFolder = "./data"
    let levelsFolder = `${dataFolder}/levels`

    // load font
    gameFont = loadFont('./fonts/abel.ttf')

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
        for (let i = 0; i < levelFiles.length; i++) {
            const file = levelFiles[i]
            const url = `${levelsFolder}/${file}`

            loadJSON(url, levelData => {
                if (levelData) {
                    const level = new Level(levelData)

                    if (level.valid) {
                        levels[i] = level
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

    // If reset was pressed while the level is finished
    // save the highscore before resetting the level
    if (currentLevel.finished) {
        currentLevel.saveHighscore()
    }

    // reset level
    currentLevel.reset(resetTime)
}

/**
 * Finishes the current level and shows an endscreen for a few seconds
 * before loading the next level.
 */
function finishLevel() {
    currentLevel.endTime = Date.now()
    currentLevel.finished = true

    // resume game after 3 seconds
    setTimeout(() => {
        currentLevel.saveHighscore()

        // Only initialize the next level if the current is still finished
        // meaning the player has not reset the current level
        if (currentLevel.finished) {
            initializeLevel()
        }
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
    rect(0, 0, scaledWidth, scaledHeight)

    noStroke()
    fill(255)

    // text
    push()
    textSize(72)
    textAlign(CENTER, BOTTOM)
    textStyle(BOLD)
    text("Herzlichen Glückwunsch!", scaledWidth / 2, scaledHeight / 2 - 72)
    pop()

    // message
    push()
    textSize(32)
    textAlign(CENTER, TOP)
    text("Du hast erfolgreich alle Level von Spaceventure absolviert. Das Spiel startet nun von vorne.\nVersuche doch deine bisherigen Bestzeiten zu knacken.", 50, scaledHeight / 2 + 32, scaledWidth - 100)
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

    // if the device is in portrait mode show an hint to turn it to landscape
    if (deviceOrientation == PORTRAIT) {
        showLandscapeHint()
        return
    }

    const redrawCanvas = update()

    if (redrawCanvas) {
        // scale app acording to calculated scale
        scale(gameScale)

        show()

        showHud()

        if (currentLevel.finished) {
            showLevelFinishScreen()
        }

        if (isInfoDebug()) {
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

    // reset level if user presses the key R
    if (keyIsDown(KEYS.R)) {
        resetLevel(true)
        return
    }

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
            player.destroy().then(() => !currentLevel.finished && player.destroyed && resetLevel(true))
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

        if (collisionSide == "bottom") {
            _switch.activate()
        }
    }

    for (const laser of currentLevel.lasers) {
        const collided = laser.detectCollison(player)

        if (collided) {
            // hit a laser
            player.destroy().then(() => !currentLevel.finished && player.destroyed && resetLevel(true))
        }
    }

    if (!landed) {
        // add gravity
        player.addForce(0.15, 90)
    }

    // Check collision with finish only if player is not destroyed
    if (!currentLevel.finished && !player.destroyed) {
        const finishReached = currentLevel.finish.detectCollison(player)

        if (finishReached) {
            finishLevel()
            return
        }
    }

    return true
}

/**
 * Redraws the canvas with the updated data each frame.
 */
function show() {
    // clear old frame
    background(20)

    push()

    // translate to player position and middle of canvas to show the spaceship always in the middle of the screen
    translate(-player.position.x + scaledWidth / 2, -player.position.y + scaledHeight / 2)

    // offset the player position a little according to the current velocity to make the camera movement smoother and more natural
    cameraOffset.x = lerp(cameraOffset.x, map(player.velocity.x, -10, 10, -150, 150, true), 0.1)
    cameraOffset.y = lerp(cameraOffset.y, map(player.velocity.y, -10, 10, -100, 100, true), 0.1)
    translate(cameraOffset.x, cameraOffset.y)

    // show all objects of the current level
    currentLevel.show()

    // the player should overlap all other objects
    player.show()

    pop()

    if (isFullDebug()) {
        // draw canvas center point
        push()
        strokeWeight(5)
        stroke(0, 255, 0)
        point(scaledWidth / 2, scaledHeight / 2)
        pop()
    }
}

function showLandscapeHint() {
    push()

    scale(gameScale)

    background(0)

    noStroke()
    fill(255)

    textSize(100)
    textAlign(CENTER, CENTER)
    text("Bitte drehe dein Smartphone in Landscape Position, um das Spiel zu spielen.", 50, scaledHeight / 2 - 250, scaledWidth - 100)

    pop()
}

function showLevelFinishScreen() {
    push()

    // curtain
    fill(0, 0, 0, 200)
    rectMode(CORNER)
    rect(0, 0, scaledWidth, scaledHeight)

    noStroke()
    fill(255)

    // text
    push()
    textSize(72)
    textAlign(CENTER, BOTTOM)
    textStyle(BOLD)
    text("Level geschafft!", scaledWidth / 2, scaledHeight / 2 - 72)
    pop()

    // time
    push()
    textSize(32)
    textAlign(CENTER, TOP)
    const time = (currentLevel.endTime - currentLevel.startTime) || 0
    const label = (!currentLevel.highscore || time < currentLevel.highscore) ? "Neue Bestzeit" : "Deine Zeit"
    text(`${label}: ${formatTime(time)}`, scaledWidth / 2, scaledHeight / 2 + 32)
    pop()

    pop()
}

function showHud() {
    push()

    noStroke()
    fill(255)
    textSize(36)

    // current time
    textAlign(LEFT, TOP)
    text(formatTime((currentLevel.endTime || Date.now()) - currentLevel.startTime), 25, 25)

    // level name
    textAlign(RIGHT, TOP)
    text(currentLevel.name.toUpperCase(), scaledWidth - 25, 25)

    textSize(22)

    // level id
    text(`LEVEL ${levels.indexOf(currentLevel) + 1}`, scaledWidth - 25, 70)

    textAlign(LEFT, TOP)
    text(formatTime(currentLevel.highscore || 0), 26, 70)

    pop()
}

let fps = 60
function showDebugInfo() {
    // calculate fps (update var every once/twice a second)
    if (frameCount % 30 == 0) {
        fps = parseInt(frameRate())
    }

    push()

    translate(scaledWidth - 200, scaledHeight - 175)

    // frame
    push()
    stroke(255, 0, 0)
    noFill()
    rect(0, 0, 175, 150)
    pop()

    // title
    push()
    noStroke()
    fill(255, 0, 0)
    textStyle(BOLD)
    text("DEBUG Information", 7, 17)
    pop()

    // fps
    push()
    noStroke()
    fill(255, 0, 0)
    textStyle(BOLD)
    textSize(20)
    text(fps, 150, 20)
    pop()

    // display/scale information
    push()
    translate(7, 40)
    noStroke()
    fill(255)
    // sizes
    text(`Screen:  ${displayWidth}x${displayHeight}`, 0, 0)
    text(`Window:  ${windowWidth}x${windowHeight}`, 0, 15)
    // scale
    text(`Scale:  ${gameScale}`, 0, 30)
    pop()

    // player information
    push()
    translate(7, 90)
    noStroke()
    fill(255)
    // position
    text("x-Position:  " + formatNumber(player.position.x, 2), 0, 0)
    text("y-Position:  " + formatNumber(player.position.y, 2), 0, 15)
    // velocity
    text("x-Velocity:  " + formatNumber(player.velocity.x, 2), 0, 30)
    text("y-Velocity:  " + formatNumber(player.velocity.y, 2), 0, 45)
    pop()

    pop()
}

function showError() {
    push()

    // curtain
    fill(0, 0, 0, 150)
    rectMode(CORNER)
    rect(0, 0, scaledWidth, scaledHeight)

    // headline
    noStroke()
    fill(255, 0, 0)
    textSize(56)
    textAlign(CENTER, BOTTOM)
    textStyle(BOLD)
    text("Fehler", 50, scaledHeight / 2 - 192, scaledWidth - 100)

    // title
    noStroke()
    fill(255)
    textSize(48)
    textAlign(CENTER, BOTTOM)
    textStyle(BOLD)
    text(error.title, 50, scaledHeight / 2 - 96, scaledWidth - 100)

    // message
    noStroke()
    fill(255)
    textSize(32)
    textAlign(CENTER, TOP)
    textStyle(NORMAL)
    text(error.message, 50, scaledHeight / 2 + 32, scaledWidth - 100)

    pop()
}
