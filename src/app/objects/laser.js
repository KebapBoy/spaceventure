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
    }
}
