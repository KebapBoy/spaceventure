class BoundingBox {
    constructor(x, y, w, h) {
        this.position = createVector(x, y)

        this.width = w
        this.height = h
    }

    intersects(other) {
        let w = 0.5 * (this.width + other.width)
        let h = 0.5 * (this.height + other.height)
        let dx = this.position.x - other.position.x
        let dy = this.position.y - other.position.y

        let collision = false
        let side

        if (abs(dx) <= w && abs(dy) <= h) {
            // collision
            collision = true

            let wy = w * dy
            let hx = h * dx

            if (wy > hx) {
                if (wy > -hx) {
                    // collision at the top
                    side = "top"
                }
                else {
                    // collision on the right
                    side = "right"
                }
            }
            else {
                if (wy > -hx) {
                    // collision on the left
                    side = "left"
                }
                else {
                    // collision at the bottom
                    side = "bottom"
                }
            }
        }

        return [collision, side]
    }

    update() {

    }

    show() {
        if (DEBUG) {
            push()

            // center point
            stroke(255, 0, 0)
            strokeWeight(1)
            noFill()
            translate(this.position.x, this.position.y)
            rectMode(CENTER)
            rect(0, 0, this.width, this.height)

            pop()
        }
    }
}

class Sprite extends BoundingBox {
    constructor(x, y, w, h) {
        super(x, y, w, h)

        this.velocity = createVector(0, 0)

        this.friction = 0
        this.flexibility = 1

        this.color = color(255)
    }

    addForce(force, angle) {
        this.velocity.x += cos(angle) * force
        this.velocity.y += sin(angle) * force
    }

    update() {
        this.velocity.x *= 1 - this.friction
        this.velocity.y *= 1 - this.friction

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        super.update()
    }

    show() {
        push()

        noStroke()
        fill(this.color)

        translate(this.position.x, this.position.y)
        rectMode(CENTER)
        rect(0, 0, this.width, this.height)

        pop()

        if (DEBUG) {
            push()

            // center point
            stroke(0, 255, 0)
            strokeWeight(1)
            line(this.position.x - 10, this.position.y, this.position.x + 10, this.position.y)
            line(this.position.x, this.position.y - 10, this.position.x, this.position.y + 10)

            pop()
        }

        super.show()
    }
}
