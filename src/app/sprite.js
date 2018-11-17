class Sprite {
    constructor(x, y, w, h) {
        this.position = createVector(x, y)
        this.velocity = createVector(0, 0)

        this.width = w
        this.height = h

        this.friction = 0
        this.flexibility = 1
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

        noStroke()
        fill(255, 255, 255)

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
    }
}
