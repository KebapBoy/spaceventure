class Spaceship extends Sprite {
    constructor(x, y, w, h) {
        super(x, y, w, h)

        this.leftThrust = false
        this.rightThrust = false
    }

    update() {
        this.leftThrust = keyIsDown(CONTROLS.LEFT_THRUST.KEY)
        this.rightThrust = keyIsDown(CONTROLS.RIGHT_THRUST.KEY)

        // both thrusts, upwards motion
        if (this.leftThrust && this.rightThrust) {
            this.addForce(0.3, -90)
        }
        // left thrust, left motion slightly upwards
        else if (this.leftThrust) {
            this.addForce(0.2, -120)
        }
        // right thrust, right motion slightly upwards
        else if (this.rightThrust) {
            this.addForce(0.2, -60)
        }

        super.update()
    }
}
