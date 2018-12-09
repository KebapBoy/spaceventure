class Platform extends Sprite {
    constructor(x, y, w, h, landable) {
        super(x, y, w, h)

        this.landable = landable
    }

    _draw() {
        noStroke()

        if (this.landable) {
            fill(color(0, 255, 0))
        }
        else {
            fill(color(255, 0, 0))
        }

        rectMode(CENTER)
        rect(0, 0, this.width, this.height)
    }
}
