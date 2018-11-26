class Spaceship extends Sprite {
    constructor(x, y, w, h) {
        super(x, y, w, h)

        this.leftThrust = false
        this.rightThrust = false
    }

    update(world) {
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
        // hovering
        else {
            if (abs(this.velocity.x) <= 0.3) {
                this.velocity.x = 0
            }

            if (abs(this.velocity.y) < 0.1) {
                this.velocity.y = 0
            }
        }

        const [intersects, side] = this.intersects(world)

        // landed on world
        if (intersects) {
            switch (side) {
                case "bottom":
                    // TODO: improve position reset
                    this.position.y = height - 10 - (this.height / 2)
                    this.velocity.y *= -this.flexibility
                    break

                case "top":
                    // TODO: improve position reset
                    this.position.y = height + (this.height / 2)
                    this.velocity.y *= -this.flexibility
                    break

                case "right":
                    // TODO: improve position reset
                    this.position.x = -this.width / 2
                    // this.velocity.x *= -this.flexibility
                    break

                case "left":
                    // TODO: improve position reset
                    this.position.x = width + (this.width / 2)
                    // this.velocity.x *= -this.flexibility
                    break
            }
        }
        // add gravity
        else {
            this.addForce(0.15, 90)
        }

        super.update()
    }
}
