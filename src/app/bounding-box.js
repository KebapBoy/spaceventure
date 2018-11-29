class BoundingBox {
    constructor(x, y, w, h) {
        this.position = createVector(x, y)

        this.width = w
        this.height = h
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
