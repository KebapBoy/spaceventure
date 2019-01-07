let path = [{ x: 0, y: 0 }]

class Spaceship extends Sprite {
    constructor() {
        super(0, 0, 30, 40)

        this.MAX_ANGLE = 16

        this.leftThrust = false
        this.rightThrust = false

        this.angle = 0

        this.startPosition = undefined
        this.destroyed = false
    }

    destroy() {
        // If the spaceship is already destroyed do nothing (reject)
        if (this.destroyed) {
            return Promise.reject()
        }

        return new Promise(resolve => {
            this.destroyed = true

            // Resolve the promise after the destroy animation finished
            setTimeout(() => resolve(), 1500)
        })
    }

    reset() {
        this.destroyed = false

        this.leftThrust = false
        this.rightThrust = false

        this.angle = 0

        this.position = this.startPosition.copy()
        this.velocity = createVector(0, 0)

        path = [{ x: this.position.x, y: this.position.y }]
    }

    update() {
        this.leftThrust = checkControl("leftThrust")
        this.rightThrust = checkControl("rightThrust")

        // Spacehsip can't be controlled anymore if destroyed
        if (this.destroyed) {
            this.leftThrust = false
            this.rightThrust = false
        }

        // both thrusts, upwards motion
        if (this.leftThrust && this.rightThrust) {
            this.addForce(0.3, -90)

            if (this.angle > 0) {
                this.angle -= 2
            }
            else if (this.angle < 0) {
                this.angle += 2
            }
        }
        // left thrust, left motion slightly downwards
        else if (this.leftThrust) {
            this.addForce(0.15, -140)

            this.angle -= 2
            if (this.angle <= -this.MAX_ANGLE) {
                this.angle = -this.MAX_ANGLE
            }
        }
        // right thrust, right motion slightly downwards
        else if (this.rightThrust) {
            this.addForce(0.15, -40)

            this.angle += 2
            if (this.angle >= this.MAX_ANGLE) {
                this.angle = this.MAX_ANGLE
            }
        }
        // hovering
        else {
            if (this.angle > 0) {
                this.angle -= 2
            }
            else if (this.angle < 0) {
                this.angle += 2
            }

            // if the velocity (x or y) is really small set it to zero
            // to prevent the spaceship stop from moving very slowly forever

            if (abs(this.velocity.x) < 0.3) {
                this.velocity.x = 0
            }

            if (abs(this.velocity.y) < 0.1) {
                this.velocity.y = 0
            }
        }

        super.update()

        if (DEBUG) {
            // update path only every fith frame ...
            if (frameCount % 5 == 0) {
                const lastPoint = path[path.length - 1]

                // ... and only when the position changed
                if (this.position.x != lastPoint.x || this.position.y != lastPoint.y) {
                    path.push({ x: this.position.x, y: this.position.y })
                }
            }
        }
    }

    show() {
        if (DEBUG) {
            push()

            stroke(255, 0, 0)

            for (let i = 1; i < path.length; i++) {
                line(path[i - 1].x, path[i - 1].y, path[i].x, path[i].y)
            }

            pop()
        }

        super.show()
    }

    _draw() {
        strokeWeight(2)

        if (this.destroyed) {
            stroke(255, 75, 75, 150)
            fill(255, 100, 100, 100)
        }
        else {
            stroke(255)
            fill(255, 255, 255, 175)
        }

        rotate(this.angle)

        triangle(0, -this.height / 2, -this.width / 2, this.height / 2, this.width / 2, this.height / 2)

        // jets
        noStroke()
        fill(255, 60, 0, 175)

        if (this.leftThrust) {
            push()
            rotate(-25)
            ellipse(this.width / 2 - 11, this.height / 2 + 10, 6, 10)
            pop()
        }

        if (this.rightThrust) {
            push()
            rotate(25)
            ellipse(-this.width / 2 + 11, this.height / 2 + 10, 6, 10)
            pop()
        }
    }
}
