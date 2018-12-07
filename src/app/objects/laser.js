class Laser extends BoundingBox {
    constructor(x, y, length, name, socket) {
        super(x, y, 5, length)

        this.name = name
        this.active = true
        this.socket = socket

        if (this.socket == "bottom") {
            this.socketPosition = this.position.copy().sub(0, -this.height / 2 + 5)
        }
        else {
            this.socketPosition = this.position.copy().sub(0, this.height / 2 - 5)
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

    show() {
        push()

        rectMode(CENTER)
        translate(this.position.x, this.position.y)

        if (this.socket == "bottom") {
            rotate(180)
        }

        noStroke()

        if (this.active) {
            // draw laser beam
            fill(255, 75, 50)
            rect(0, 0, 5, this.height)
        }

        // draw socket
        fill(255, 255, 255)
        rect(0, -this.height / 2 + 5, 12, 10)

        super.show()

        pop()
    }
}
