class Spaceship extends Sprite {
    constructor(x, y, w, h) {
        super(x, y, w, h)

        this.leftThrust = false
        this.rightThrust = false
    }

    update() {
        this.leftThrust = keyIsDown(CONTROLS.LEFT_THRUST.KEY)
        this.rightThrust = keyIsDown(CONTROLS.RIGHT_THRUST.KEY)

        if (touches.length) {
            if (!this.leftThrust) {
                this.leftThrust = touches.some(touch => touch.x < width / 2)
            }

            if (!this.rightThrust) {
                this.rightThrust = touches.some(touch => touch.x > width / 2)
            }
        }

        // both thrusts, upwards motion
        if (this.leftThrust && this.rightThrust) {
            this.addForce(0.3, -90)
        }
        // left thrust, left motion slightly upwards
        else if (this.leftThrust) {
            this.addForce(0.15, -140)
        }
        // right thrust, right motion slightly upwards
        else if (this.rightThrust) {
            this.addForce(0.15, -40)
        }
        // hovering
        else {
            if (abs(this.velocity.x) <= 0.3) {
                this.velocity.x = 0
            }

            if (abs(this.velocity.y) < 0.1) {
                this.velocity.y = 0
            }
        }

        super.update()
    }
}
