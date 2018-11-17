let player

function setup() {
    createCanvas(500, 500)

    angleMode(DEGREES)

    player = new Spaceship(width / 2, 0, 10, 20)
    player.friction = 0.02
    player.flexibility = 0.25

    // prevent contextmenu on mouse right click
    document.getElementsByTagName("canvas")[0].addEventListener("contextmenu", e => e.preventDefault())
}

function draw() {
    background(0)

    player.update()
    player.show()

    // ground
    noStroke()
    fill(255, 0, 0)
    rect(0, height - 10, width, 10)

    // detect ground hit
    if (player.position.y + (player.height / 2) >= height - 10) {
        player.position.y = height - 10 - (player.height / 2)
        player.velocity.y *= -player.flexibility
    }
    else {
        // gravity
        player.addForce(0.15, 90)
    }

    // endless left and right
    if (player.position.x > width) {
        player.position.x = 0
    }
    else if (player.position.x < 0) {
        player.position.x = width
    }

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
