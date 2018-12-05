class Finish extends BoundingBox {
    constructor(x, y) {
        super(x, y, 50, 50)
    }

    show() {
        push()

        rectMode(CENTER)
        translate(this.position.x, this.position.y)

        stroke(255)
        noFill()
        rect(0, 0, this.width, this.height)

        super.show()

        pop()
    }
}
