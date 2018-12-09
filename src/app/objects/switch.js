class Switch extends Sprite {
    constructor(x, y) {
        super(x, y, 30, 30)

        this.active = false

        this.connectedLaser = []
    }

    activate() {
        this.active = true

        for (let laser of this.connectedLaser) {
            if (typeof laser.activate == "function") {
                laser.deactivate()
            }
        }
    }

    deactivate() {
        this.active = false

        for (let laser of this.connectedLaser) {
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

        for (let laser of this.connectedLaser) {
            // draw connection line to laser

            if (this.active) {
                stroke(0, 0, 255, 200)
            }
            else {
                stroke(0, 0, 255, 100)
            }

            dashline(this.position.x, this.position.y + 15, laser.socketPosition.x, laser.socketPosition.y, 10, 10)
        }

        pop()

        super.show()
    }

    _draw() {
        noStroke()
        fill(255)

        rectMode(CENTER)

        // socket
        rect(0, 17, this.width, 6)

        translate(0, 15)

        let rodAngle
        let knobColor

        if (this.active) {
            rodAngle = 25
            knobColor = color(0, 255, 0)
        }
        else {
            rodAngle = -25
            knobColor = color(255, 0, 0)
        }

        // rod
        rotate(rodAngle)
        rect(0, -this.height / 2 + 2, 4, this.height)

        // knob
        fill(knobColor)
        ellipse(0, -this.height + 7, 10)
    }
}
