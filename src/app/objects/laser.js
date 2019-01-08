class Laser extends Sprite {
    constructor(x, y, length, name, socket) {
        super(x, y, 9, length)

        this.name = name
        this.active = true
        this.socket = socket

        if (this.socket == "bottom") {
            this.socketPosition = this.position.copy().sub(0, -this.height / 2 + 8)
        }
        else {
            this.socketPosition = this.position.copy().sub(0, this.height / 2 - 8)
        }
    }

    activate() {
        this.active = true
        this.collisionEnabled = true
    }

    deactivate() {
        this.active = false
        this.collisionEnabled = false
    }

    _draw() {
        noStroke()
        rectMode(CENTER)

        if (this.active) {
            // draw laser beam
            fill(255, 75, 50, 200)
            rect(0, 0, 9, this.height)
            // Removed due to performance problems
            // gradientRect(-this.width / 2, -this.height / 2, 9, this.height, color(255, 75, 50, 40), color(255, 75, 50, 225), "y")

            fill(255, 125, 125)
        }
        else {
            fill(100)
        }

        if (this.socket == "bottom") {
            rotate(180)
        }

        // draw socket
        strokeWeight(2)
        stroke(150)
        rect(0, -this.height / 2 + 8, 20, 16)

        if (this.active && (frameCount % 4) < 2) {
            // draw ending sparkles
            stroke(255, 75, 50, 50)

            line(-1, this.height / 2 - 1, -this.width / 2 - 50, this.height / 2 - 7)
            line(1, this.height / 2 - 1, this.width / 2 + 50, this.height / 2 - 7)

            line(-1, this.height / 2 - 2, -this.width / 2 - 25, this.height / 2 - 8)
            line(1, this.height / 2 - 2, this.width / 2 + 25, this.height / 2 - 8)

            line(-1, this.height / 2 - 3, -this.width / 2 - 10, this.height / 2 - 10)
            line(1, this.height / 2 - 3, this.width / 2 + 10, this.height / 2 - 10)
        }
    }
}
