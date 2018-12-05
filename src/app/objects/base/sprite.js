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
    }

    show() {
        push()

        rectMode(CENTER)
        translate(this.position.x, this.position.y)

        noStroke()
        fill(this.color)
        rect(0, 0, this.width, this.height)

        super.show()

        if (DEBUG) {
            push()

            // draw center point (position)
            stroke(0, 255, 0)
            line(-10, 0, 10, 0)
            line(0, -10, 0, 10)

            pop()
        }

        pop()
    }
}
