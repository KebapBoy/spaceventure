let player
let level = {
    objects: [],
    lasers: [],
    switches: [],
    finish: undefined,
}

let levelFinished = false

function setup() {
    createCanvas(windowWidth, windowHeight)

    angleMode(DEGREES)

    player = new Spaceship(width / 2, height / 2, 30, 40)
    player.friction = 0.01
    player.flexibility = 0.5

    level = initializeLevel()

    // prevent contextmenu on mouse right click
    document.getElementsByTagName("canvas")[0].addEventListener("contextmenu", e => e.preventDefault())

    // resize canvas on browser resize
    window.addEventListener("resize", () => resizeCanvas(windowWidth, windowHeight))
}

function initializeLevel() {
    let objects = []
    let lasers = []
    let switches = []

    let ceiling = new Platform(width / 2, 5, width - 20, 10)
    ceiling.color = color(255, 0, 0)
    objects.push(ceiling)

    let floor = new Platform(width / 2, height - 5, width - 20, 10)
    floor.color = color(255, 0, 0)
    objects.push(floor)

    let wallLeft = new Platform(5, height / 2, 10, height)
    wallLeft.color = color(255, 0, 0)
    objects.push(wallLeft)

    let wallRight = new Platform(width - 5, height / 2, 10, height)
    wallRight.color = color(255, 0, 0)
    objects.push(wallRight)

    let platform = new Platform(width / 2 - 5, height / 2 + height / 4 - 5, width / 2, 10)
    platform.landable = true
    platform.color = color(0, 255, 0)
    objects.push(platform)

    let platformRight = new Platform(width / 2 + width / 4, height / 2 - height / 8 + 5, 10, height - height / 4 - 10)
    platformRight.landable = true
    platformRight.color = color(0, 255, 0)
    objects.push(platformRight)

    let platformTop = new Platform(width / 2 + width / 4 - width / 16 - 5, height / 2 - height / 8, width / 8, 10)
    platformTop.landable = true
    platformTop.color = color(0, 255, 0)
    objects.push(platformTop)

    let laser1 = new Laser(width / 4 + 10, height / 2 - height / 8, height / 2 + height / 4 - 20)
    lasers.push(laser1)

    let switch1 = new Switch(width / 2 + width / 4 - width / 16 - 5, height / 2 - height / 8 - 20, 20, 30)
    switch1.connectLaser(laser1)
    switches.push(switch1)

    let finish = new Finish(width - 65, 65)

    return {
        objects,
        switches,
        lasers,
        finish
    }
}

function draw() {
    if (!this.levelFinished) {
        update()
    }

    if (!this.levelFinished) {
        show()

        if (DEBUG) {
            this.drawDebugInfo()
        }
    }
}

function update() {
    player.update()

    let landed = false

    for (let object of level.objects) {
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

    for (let _switch of level.switches) {
        const collided = _switch.detectCollison(player)

        if (collided) {
            _switch.activate()
        }
    }

    for (let laser of level.lasers) {
        const collided = laser.detectCollison(player)

        if (collided) {
            // hit a laser
            resetLevel()
        }
    }

    const finishReached = level.finish.detectCollison(player)
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

    for (let object of level.objects) {
        object.show()
    }

    for (let _switch of level.switches) {
        _switch.show()
    }

    for (let laser of level.lasers) {
        laser.show()
    }

    level.finish.show()

    player.show()

    pop()
}

function resetLevel() {
    player.position = createVector(width / 2, height / 2)
    player.velocity = createVector(0, 0)

    for (let _switch of level.switches) {
        _switch.deactivate()
    }

    for (let laser of level.lasers) {
        laser.activate()
    }

    this.levelFinished = false
}

function finishLevel() {
    this.levelFinished = true

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

    // resume game after 5 seconds
    setTimeout(() => {
        resetLevel()
    }, 3000)
}

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

let fps = 60
