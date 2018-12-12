/**
 * Adds a bounding box for collision to an object.
 */
class BoundingBox {
    constructor(x, y, w, h) {
        this.position = createVector(x, y)

        this.width = w
        this.height = h

        this.collisionEnabled = true
    }

    getPosition(side) {
        switch (side) {
            case "top":
                return this.position.copy().sub(0, this.height / 2)
            case "bottom":
                return this.position.copy().add(0, this.height / 2)
            case "right":
                return this.position.copy().add(this.width / 2, 0)
            case "left":
                return this.position.copy().sub(this.width / 2, 0)
        }
    }

    detectCollison(other) {
        // collision is disabled
        if (!this.collisionEnabled) return

        /*
         * Collision detection based on the Minkowski addition (https://en.wikipedia.org/wiki/Minkowski_addition).
         * Thanks to markE (https://stackoverflow.com/a/29861691).
         */

        let width = (this.width + other.width) / 2
        let height = (this.height + other.height) / 2
        let deltaX = this.position.x - other.position.x
        let deltaY = this.position.y - other.position.y

        if (abs(deltaX) <= width && abs(deltaY) <= height) {
            let crossWidth = width * deltaY
            let crossHeight = height * deltaX

            if (crossWidth > crossHeight) {
                return crossWidth > -crossHeight ? "bottom" : "left"
            }
            else {
                return crossWidth > -crossHeight ? "right" : "top"
            }
        }
    }

    show() {
        if (this.collisionEnabled && DEBUG) {
            push()

            // draw bounding box
            noFill()
            stroke(255, 0, 0)

            rectMode(CENTER)
            rect(0, 0, this.width, this.height)

            pop()
        }
    }
}
