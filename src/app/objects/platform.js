class Platform extends Sprite {
    constructor(x, y, w, h, landable) {
        super(x, y, w, h)

        this.landable = landable
    }

    _draw() {
        noStroke()

        if (this.landable) {
            fill(0, 200, 0)
        }
        else {
            fill(200, 0, 0)
        }

        rectMode(CENTER)
        rect(0, 0, this.width, this.height)
    }
}
