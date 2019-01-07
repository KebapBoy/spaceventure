// Ported from Processing. Thanks to J David Eisenberg (https://www.openprocessing.org/sketch/7013/).
//
// Small edits made to improve performance and to cut of the line on ending point.

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
            // Add dash spacing to current x and y coordinate
            // but only up to x1 and y1 to prevent an overlapping dash
            let _x0 = min(x0 + dashSpacing.x, x1)
            let _y0 = min(y0 + dashSpacing.y, y1)

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
