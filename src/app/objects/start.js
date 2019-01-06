class Start extends Sprite {
    constructor(x, y) {
        super(x, y, 60, 60)
    }

    _draw() {
        noStroke()
        fill(255, 255, 255, 75)
        rectMode(CENTER)
        rect(0, 0, this.width, this.height)

        fill(255)
        textAlign(CENTER, CENTER)
        textSize(18)
        text("START", 0, 0)
    }
}
