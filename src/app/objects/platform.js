class Platform extends Sprite {
    constructor(x, y, w, h, landable) {
        super(x, y, w, h)

        this.landable = landable
        this.color = this.landable ? color(0, 255, 0) : color(255, 0, 0)
    }
}
