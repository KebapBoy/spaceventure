let player
let world = []

function setup() {
    createCanvas(windowWidth, windowHeight)

    angleMode(DEGREES)

    player = new Spaceship(width / 2, height / 2, 30, 40)
    player.friction = 0.01
    player.flexibility = 0.5

    world = initializeWorld()

    // prevent contextmenu on mouse right click
    document.getElementsByTagName("canvas")[0].addEventListener("contextmenu", e => e.preventDefault())

    // resize canvas on browser resize
    window.addEventListener("resize", () => resizeCanvas(windowWidth, windowHeight))
}

function initializeWorld() {
    let objects = []

    let ceiling = new Platform(width / 2, 5, width, 10)
    ceiling.color = color(255, 0, 0)
    objects.push(ceiling)

    let floorLeft = new Platform(width / 4 - width / 32, height - 5, width / 2 - width / 16, 10)
    floorLeft.color = color(255, 0, 0)
    objects.push(floorLeft)

    let floorMiddle = new Platform(width / 2, height - 5, width / 8, 10)
    floorMiddle.landable = true
    floorMiddle.color = color(0, 255, 0)
    objects.push(floorMiddle)

    let floorRight = new Platform(width / 2 + width / 4 + width / 32, height - 5, width / 2 - width / 16, 10)
    floorRight.color = color(255, 0, 0)
    objects.push(floorRight)

    let wallLeft = new Platform(5, height / 2, 10, height)
    wallLeft.color = color(255, 0, 0)
    objects.push(wallLeft)

    let wallRight = new Platform(width - 5, height / 2, 10, height)
    wallRight.color = color(255, 0, 0)
    objects.push(wallRight)

    return objects
}

function draw() {
    background(0)

    update()
    show()

    if (DEBUG) {
        this.drawDebugInfo()
    }
}

function update() {
    player.update()

    let landed = false

    for (let object of world) {
        const collisionSide = object.detectCollison(player)

        if (object.landable && collisionSide == "bottom") {
            // landed on save platform
            let objectTopPosition = object.getPosition("top")

            // TODO: improve position reset
            player.position.y = objectTopPosition.y - (player.height / 2)
            player.velocity.y *= -player.flexibility
            player.velocity.x *= player.flexibility
        }
        else if (!!collisionSide) {
            // hit an object
            resetLevel()
        }
    }

    // add gravity
    if (!landed) {
        player.addForce(0.15, 90)
    }
}

function show() {
    push()

    // translate to player position to show the spaceship in the middle of the screen
    translate(-player.position.x + width / 2, -player.position.y + height / 2)

    for (let object of world) {
        object.show()
    }

    player.show()

    pop()
}

function resetLevel() {
    player.position = createVector(width / 2, height / 2)
    player.velocity = createVector(0, 0)
}

function drawDebugInfo() {
    push()

    translate(25, 25)

    // frame
    push()
    stroke(255, 0, 0)
    noFill()
    rect(0, 0, 150, 100)
    pop()

    // title
    push()
    noStroke()
    fill(255, 0, 0)
    textStyle(BOLD)
    text("DEBUG Information", 5, 15)
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
