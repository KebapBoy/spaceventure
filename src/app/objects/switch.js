class Switch extends Sprite {
    constructor(x, y) {
        super(x, y, 30, 16)

        this.active = false

        this.connectedLaser = []
    }

    activate() {
        this.active = true

        for (const laser of this.connectedLaser) {
            if (typeof laser.deactivate == "function") {
                laser.deactivate()
            }
        }
    }

    deactivate() {
        this.active = false

        for (const laser of this.connectedLaser) {
            if (typeof laser.activate == "function") {
                laser.activate()
            }
        }
    }

    connectLaser(laser) {
        this.connectedLaser.push(laser)
    }

    show() {
        push()

        strokeWeight(5)

        for (const laser of this.connectedLaser) {
            // draw connection line to laser

            if (this.active) {
                stroke(0, 0, 255, 200)
            }
            else {
                stroke(0, 0, 255, 100)
            }

            dashline(this.position.x, this.position.y + 5, laser.socketPosition.x, laser.socketPosition.y, 10, 20)
        }

        pop()

        super.show()
    }

    _draw() {
        rectMode(CENTER)
        strokeWeight(2)

        push()
        if (this.active) {
            translate(0, 1)
            fill(0, 200, 0)
            stroke(0, 255, 0)
        }
        else {
            translate(0, -5)
            fill(200, 0, 0)
            stroke(255, 0, 0)
        }

        // button
        rect(0, 0, 26, 10)
        pop()

        // socket
        stroke(100)
        fill(150)
        rect(0, 4, this.width, 8)
    }
}
