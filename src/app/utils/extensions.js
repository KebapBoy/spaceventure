/**
 * Draw a dashed line with given dash and gap length.
 *
 * @param {number} x0 starting x-coordinate of line
 * @param {number} y0 starting y-coordinate of line
 * @param {number} x1 ending x-coordinate of line
 * @param {number} y1 ending y-coordinate of line
 * @param {number} dash length of dashed line in pixels
 * @param {number} gap space between dashes in pixels
 *
 * Ported from Processing. Thanks to J David Eisenberg (https://www.openprocessing.org/sketch/7013/).
 * Small edits made to improve performance and to cut of the line on ending point.
 */
function dashline(x0, y0, x1, y1, dash, gap) {
    const distance = dist(x0, y0, x1, y1)

    if (distance <= 0) return

    let drawn = 0  // amount of distance drawn

    // Figure out x and y distances for each dash and gap
    const dashSpacing = {
        x: lerp(0, (x1 - x0), dash / distance),
        y: lerp(0, (y1 - y0), dash / distance),
    }

    const gapSpacing = {
        x: lerp(0, (x1 - x0), gap / distance),
        y: lerp(0, (y1 - y0), gap / distance),
    }

    let drawDash = true

    while (drawn < distance) {
        if (drawDash) {
            // Add dash spacing to current x and y coordinate ...
            let _x0 = x0 + dashSpacing.x
            let _y0 = y0 + dashSpacing.y

            // ... but only up to x1 and y1 to prevent an overlapping dash
            if (_x0 > abs(x1)) _x0 = x1
            if (_y0 > abs(y1)) _y0 = y1

            line(x0, y0, _x0, _y0)

            x0 = _x0
            y0 = _y0

            // Add dash length to drawn distance
            drawn += dash
        }
        else {
            x0 += gapSpacing.x
            y0 += gapSpacing.y

            // Add gap length to drawn distance
            drawn += gap
        }

        // alternate between dash and gap
        drawDash = !drawDash
    }
}

/**
 * Draw a rectangle filled with a gradient of given colors.
 *
 * @param {number} x starting x-coordinate of gradient rect
 * @param {number} y starting x-coordinate of gradient rect
 * @param {number} w width of gradient rect
 * @param {number} h height of gradient rect
 * @param {number} c1 gradient starting color
 * @param {number} c2 gradient ending color
 * @param {string} axis direction of gradient, either "y" or "x"
 *
 * Thanks to P5 Examples (https://p5js.org/examples/color-linear-gradient.html).
 * Small edits made.
 */
function gradientRect(x, y, w, h, c1, c2, axis) {
    noFill()

    if (axis == "y") {
        // Top to bottom gradient
        for (let i = y; i <= y + h; i++) {
            let inter = map(i, y, y + h, 0, 1)
            let c = lerpColor(c1, c2, inter)
            stroke(c)
            line(x, i, x + w, i)
        }
    }
    else if (axis == "x") {
        // Left to right gradient
        for (let i = x; i <= x + w; i++) {
            let inter = map(i, x, x + w, 0, 1)
            let c = lerpColor(c1, c2, inter)
            stroke(c)
            line(i, y, i, y + h)
        }
    }
}
