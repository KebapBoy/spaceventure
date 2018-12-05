function getLevel1() {
    let id = 1
    let objects = []
    let lasers = []
    let switches = []

    let ceiling = new Platform(750, 5, 1500, 10)
    ceiling.color = color(255, 0, 0)
    objects.push(ceiling)

    let floor = new Platform(750, 995, 1500, 10)
    floor.color = color(255, 0, 0)
    objects.push(floor)

    let wallLeft = new Platform(5, 500, 10, 980)
    wallLeft.color = color(255, 0, 0)
    objects.push(wallLeft)

    let wallRight = new Platform(1495, 500, 10, 980)
    wallRight.color = color(255, 0, 0)
    objects.push(wallRight)

    let platform = new Platform(745, 705, 750, 10)
    platform.landable = true
    platform.color = color(0, 255, 0)
    objects.push(platform)

    let platformRight = new Platform(1125, 360, 10, 700)
    platformRight.landable = true
    platformRight.color = color(0, 255, 0)
    objects.push(platformRight)

    let platformTop = new Platform(1020, 375, 200, 10)
    platformTop.landable = true
    platformTop.color = color(0, 255, 0)
    objects.push(platformTop)

    let laser1 = new Laser(385, 355, 690)
    lasers.push(laser1)

    let switch1 = new Switch(1020, 355, 20, 30)
    switch1.connectLaser(laser1)
    switches.push(switch1)

    let start = createVector(1020, 455)
    let finish = new Finish(1315, 175)

    return {
        id,
        objects,
        switches,
        lasers,
        start,
        finish,
    }
}
