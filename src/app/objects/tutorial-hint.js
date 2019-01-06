class TutorialHint extends Sprite {
    constructor(x, y, text) {
        super(x, y, 0, 0)

        this.MAX_WIDTH = 400

        this.text = text
        this.collisionEnabled = false
    }

    _draw() {
        noStroke()
        fill(255, 255, 255, 175)
        textSize(26)
        textAlign(LEFT, TOP)
        text(this.text, 0, 0, this.MAX_WIDTH)
    }
}
