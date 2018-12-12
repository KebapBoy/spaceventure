let currentLevel = undefined
let player

/**
 * Called by p5 at game start.
 * Initialize the game.
 */
function setup() {
    // the canvas should fill the browser viewport
    createCanvas(windowWidth, windowHeight)

    // always work with degree angles
    angleMode(DEGREES)

    initializeLevel()

    player = new Spaceship()
    player.friction = 0.01
    player.flexibility = 0.5

    // prevent contextmenu on mouse right click
    document.getElementsByTagName("canvas")[0].addEventListener("contextmenu", e => e.preventDefault())

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
}

/**
 * Initialized the current level.
 *
 * Either the first level on game start or the next level on level finish.
 */
function initializeLevel() {
    let currentLevelId

    if (!currentLevel) {
        currentLevelId = 1
    }
    else {
        currentLevelId = currentLevel.id + 1
    }

    let url = `./data/levels/level-${currentLevelId}.json`

    loadJSON(url, levelData => {
        if (!levelData) return

        currentLevel = new Level(levelData)

        if (currentLevel.valid) {
            // set spaceship start position
            player.startPosition = currentLevel.start.position.copy()
        }
        else {
            console.error(
                "The level file does not contain valid data.",
                `Failed to load level file: ${url}`
            )
        }
    })
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
 * Finishes the current level and show an endscreen for a few seconds
 * before loading the next level.
 */
function finishLevel() {
    storeHighscore(currentLevel.id, Date.now() - currentLevel.startTime)
    currentLevel.finished = true

    push()

    // curtain
    fill(0, 0, 0, 150)
    rectMode(CORNER)
    rect(0, 0, width, height)

    // text
    noStroke()
    fill(255)
    textSize(32)
    textAlign(CENTER)
    textStyle(BOLD)
    text("LEVEL FINISHED", width / 2, height / 2)

    pop()

    // resume game after 3 seconds
    setTimeout(() => {
        resetLevel(true)
    }, 3000)
}

/**
 * Called by p5 every frame.
 * The game loop.
 */
function draw() {
    // wait for level to load
    if (!currentLevel || !currentLevel.initialized) return

    // wait for level end screen to finish
    if (currentLevel.finished) return

    const redrawCanvas = update()

    if (redrawCanvas) {
        show()

        drawHud()

        if (DEBUG) {
            this.drawDebugInfo()
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

    for (let platform of currentLevel.platforms) {
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

    for (let _switch of currentLevel.switches) {
        const collisionSide = _switch.detectCollison(player)

        if (collisionSide == "right") {
            _switch.activate()
        }
        else if (collisionSide == "left") {
            _switch.deactivate()
        }
    }

    for (let laser of currentLevel.lasers) {
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

function drawHud() {
    push()

    noStroke()
    fill(255)
    textSize(36)

    // current time
    textAlign(LEFT, TOP)
    text(formatTime(Date.now() - currentLevel.startTime), 25, 25)

    // level name
    textAlign(RIGHT, TOP)
    text(currentLevel.name, width - 25, 25)

    textSize(22)

    // level id
    text(`LEVEL ${currentLevel.id}`, width - 25, 70)

    textAlign(LEFT, TOP)
    text(formatTime(currentLevel.highscore) || "00:00:00", 26, 70)

    pop()
}

let fps = 60
function drawDebugInfo() {
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

