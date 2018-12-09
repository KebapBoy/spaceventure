class Start extends Sprite {
    constructor(x, y) {
        super(x, y, 50, 50)
    }

    _draw() {
        stroke(255)
        noFill()

        rectMode(CENTER)
        rect(0, 0, this.width, this.height)

        textAlign(CENTER, CENTER)
        text("START", 0, 0)
    }
}
