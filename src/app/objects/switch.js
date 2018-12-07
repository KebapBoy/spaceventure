class Switch extends Sprite {
    constructor(x, y) {
        super(x, y, 20, 30)

        this.active = false
        this.color = color(0, 0, 255, 126)

        this.connectedLaser = []
    }

    activate() {
        this.active = true
        this.color = color(0, 0, 255, 255)

        for (let laser of this.connectedLaser) {
            if (typeof laser.activate == "function") {
                laser.deactivate()
            }
        }
    }

    deactivate() {
        this.active = false
        this.color = color(0, 0, 255, 126)
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

            dashline(this.position.x, this.position.y, laser.socketPosition.x, laser.socketPosition.y, 10, 10)
        }

        pop()

        super.show()
    }
}
