// Ported from Processing. Thanks to J David Eisenberg (https://www.openprocessing.org/sketch/7013/).

/*
 * Draw a dashed line with given dash and gap length.
 * x0 starting x-coordinate of line.
 * y0 starting y-coordinate of line.
 * x1 ending x-coordinate of line.
 * y1 ending y-coordinate of line.
 * dash - length of dashed line in pixels
 * gap - space between dashes in pixels
 */
function dashline(x0, y0, x1, y1, dash, gap) {
    let spacing = [dash, gap]
    let distance = dist(x0, y0, x1, y1)
    let xSpacing = []
    let ySpacing = []
    let drawn = 0.0  // amount of distance drawn

    if (distance > 0) {
        /*
          Figure out x and y distances for each of the spacing values
          I decided to trade memory for time I'd rather allocate
          a few dozen bytes than have to do a calculation every time
          I draw.
        */
        for (const i = 0; i < spacing.length; i++) {
            xSpacing[i] = lerp(0, (x1 - x0), spacing[i] / distance)
            ySpacing[i] = lerp(0, (y1 - y0), spacing[i] / distance)
        }

        let i = 0
        let drawLine = true // alternate between dashes and gaps

        while (drawn < distance) {
            if (drawLine) {
                line(x0, y0, x0 + xSpacing[i], y0 + ySpacing[i])
            }

            x0 += xSpacing[i]
            y0 += ySpacing[i]

            /* Add distance "drawn" by this line or gap */
            drawn = drawn + mag(xSpacing[i], ySpacing[i])

            i = (i + 1) % spacing.length  // cycle through array
            drawLine = !drawLine  // switch between dash and gap
        }
    }
}
