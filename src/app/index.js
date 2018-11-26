let player
let ground

function setup() {
    createCanvas(500, 500)

    angleMode(DEGREES)

    player = new Spaceship(width / 2, 0, 30, 40)
    player.friction = 0.02
    player.flexibility = 0.5

    ground = new Sprite(width / 2, height - 5, width, 10)
    ground.color = color(255, 0, 0)

    // prevent contextmenu on mouse right click
    document.getElementsByTagName("canvas")[0].addEventListener("contextmenu", e => e.preventDefault())
}

function draw() {
    background(0)

    push()

    translate(-player.position.x + width / 2, -player.position.y + height / 2)

    ground.update()
    ground.show()

    player.update(ground)
    player.show()

    pop()

    if (DEBUG) {
        this.drawDebugInfo()
    }
}

function drawDebugInfo() {
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
    // velocity
    text("x-Velocity:  " + formatNumber(player.velocity.x, 2), 5, 35)
    text("y-Velocity:  " + formatNumber(player.velocity.y, 2), 5, 50)
    pop()
}
