let currentLevel = undefined
let player

function setup() {
    // the canvas should fill the browser viewport
    createCanvas(windowWidth, windowHeight)

    // always work with degree angles
    angleMode(DEGREES)

    currentLevel = initializeLevel()

    player = new Spaceship(width / 2, height / 2, 30, 40)
    player.friction = 0.01
    player.flexibility = 0.5

    // prevent contextmenu on mouse right click
    document.getElementsByTagName("canvas")[0].addEventListener("contextmenu", e => e.preventDefault())

    // resize canvas on browser resize
    window.addEventListener("resize", () => resizeCanvas(windowWidth, windowHeight))
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

    return window[`getLevel${currentLevelId}`]()
}

/**
 * Resets the current level to the initial state.
 *
 * The players position, all switches and all lasers will be resetted.
 */
function resetLevel() {
    player.position = createVector(width / 2, height / 2)
    player.velocity = createVector(0, 0)

    for (let _switch of currentLevel.switches) {
        _switch.deactivate()
    }

    for (let laser of currentLevel.lasers) {
        laser.activate()
    }

    currentLevel.finished = false
}


/**
 * Finishes the current level and show an endscreen for a few seconds
 * before loading the next level.
 */
function finishLevel() {
    currentLevel.finished = true

    push()

    // curtain
    fill(0, 0, 0, 100)
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
        resetLevel()
    }, 3000)
}

function draw() {
    if (!currentLevel.finished) {
        update()
    }

    if (!currentLevel.finished) {
        show()

        if (DEBUG) {
            this.drawDebugInfo()
        }
    }
}

function update() {

    // reset level if user presses the key R
    if (keyIsDown(KEYS.R)) {
        resetLevel()
    }

    player.update()

    let landed = false

    for (let object of currentLevel.objects) {
        const collisionSide = object.detectCollison(player)

        // no collision happened
        if (!collisionSide) continue

        if (object.landable) {

            // bounce of landable object
            if (collisionSide == "bottom" || collisionSide == "top") {
                if (collisionSide == "bottom") {
                    // bounce of from objects top side -> landed on object
                    landed = true
                    let objectPosition = object.getPosition("top")
                    player.position.y = objectPosition.y - (player.height / 2)
                }
                else {
                    // bounce of from objects bottom side
                    let objectPosition = object.getPosition("bottom")
                    player.position.y = objectPosition.y + (player.height / 2)
                }

                player.velocity.y *= -player.flexibility
                player.velocity.x *= player.flexibility
            }
            else {
                if (collisionSide == "left") {
                    // bounce of from objects right side
                    let objectPosition = object.getPosition("right")
                    player.position.x = objectPosition.x + (player.width / 2)
                }
                else {
                    // bounce of from objects left side
                    let objectPosition = object.getPosition("left")
                    player.position.x = objectPosition.x - (player.width / 2)
                }

                player.velocity.x *= -player.flexibility
            }
        }
        else {
            // hit a not landable object
            resetLevel()
        }
    }

    for (let _switch of currentLevel.switches) {
        const collided = _switch.detectCollison(player)

        if (collided) {
            _switch.activate()
        }
    }

    for (let laser of currentLevel.lasers) {
        const collided = laser.detectCollison(player)

        if (collided) {
            // hit a laser
            resetLevel()
        }
    }

    const finishReached = currentLevel.finish.detectCollison(player)
    if (finishReached) {
        finishLevel()
    }

    // add gravity
    if (!landed) {
        player.addForce(0.15, 90)
    }
}

function show() {
    background(0)

    push()

    // translate to player position to show the spaceship in the middle of the screen
    translate(-player.position.x + width / 2, -player.position.y + height / 2)

    for (let object of currentLevel.objects) {
        object.show()
    }

    for (let _switch of currentLevel.switches) {
        _switch.show()
    }

    for (let laser of currentLevel.lasers) {
        laser.show()
    }

    currentLevel.finish.show()

    player.show()

    pop()
}

let fps = 60
function drawDebugInfo() {
    // calculate fps (update var every once/twice a second)
    if (frameCount % 30 == 0) {
        fps = parseInt(frameRate())
    }

    push()

    translate(25, 25)

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

