class Switch extends Sprite {
    constructor(x, y) {
        super(x, y, 30, 20)

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

            dashline(this.position.x, this.position.y + 10, laser.socketPosition.x, laser.socketPosition.y, 10, 20)
        }

        pop()

        super.show()
    }

    _draw() {
        rectMode(CENTER)
        noStroke()

        push()

        let fillColor

        if (this.active) {
            translate(0, 3)
            fillColor = color(0, 200, 0)
        }
        else {
            translate(0, -3)
            fillColor = color(200, 0, 0)
        }

        fill(fillColor)
        rect(0, 0, 26, 10)

        pop()

        // socket
        fill(150)
        rect(0, 6, this.width, 8)
    }
}
