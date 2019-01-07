class Platform extends Sprite {
    constructor(x, y, w, h, landable) {
        super(x, y, w, h)

        this.landable = landable
    }

    _draw() {
        noStroke()

        if (this.landable) {
            fill(70, 80, 80)
        }
        else {
            fill(200, 70, 70)
        }

        rectMode(CENTER)
        rect(0, 0, this.width, this.height)
    }
}
