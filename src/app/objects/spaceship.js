class Spaceship extends Sprite {
    constructor(x, y, w, h) {
        super(x, y, w, h)

        this.leftThrust = false
        this.rightThrust = false
    }

    update() {
        this.leftThrust = checkControl("leftThrust")
        this.rightThrust = checkControl("rightThrust")

        // both thrusts, upwards motion
        if (this.leftThrust && this.rightThrust) {
            this.addForce(0.3, -90)
        }
        // left thrust, left motion slightly downwards
        else if (this.leftThrust) {
            this.addForce(0.15, -140)
        }
        // right thrust, right motion slightly downwards
        else if (this.rightThrust) {
            this.addForce(0.15, -40)
        }
        // hovering
        else {
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
    }
}
