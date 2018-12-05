function getLevel1() {
    let id = 1
    let objects = []
    let lasers = []
    let switches = []

    let ceiling = new Platform(width / 2, 5, width - 20, 10)
    ceiling.color = color(255, 0, 0)
    objects.push(ceiling)

    let floor = new Platform(width / 2, height - 5, width - 20, 10)
    floor.color = color(255, 0, 0)
    objects.push(floor)

    let wallLeft = new Platform(5, height / 2, 10, height)
    wallLeft.color = color(255, 0, 0)
    objects.push(wallLeft)

    let wallRight = new Platform(width - 5, height / 2, 10, height)
    wallRight.color = color(255, 0, 0)
    objects.push(wallRight)

    let platform = new Platform(width / 2 - 5, height / 2 + height / 4 - 5, width / 2, 10)
    platform.landable = true
    platform.color = color(0, 255, 0)
    objects.push(platform)

    let platformRight = new Platform(width / 2 + width / 4, height / 2 - height / 8 + 5, 10, height - height / 4 - 10)
    platformRight.landable = true
    platformRight.color = color(0, 255, 0)
    objects.push(platformRight)

    let platformTop = new Platform(width / 2 + width / 4 - width / 16 - 5, height / 2 - height / 8, width / 8, 10)
    platformTop.landable = true
    platformTop.color = color(0, 255, 0)
    objects.push(platformTop)

    let laser1 = new Laser(width / 4 + 10, height / 2 - height / 8, height / 2 + height / 4 - 20)
    lasers.push(laser1)

    let switch1 = new Switch(width / 2 + width / 4 - width / 16 - 5, height / 2 - height / 8 - 20, 20, 30)
    switch1.connectLaser(laser1)
    switches.push(switch1)

    let finish = new Finish(width - 65, 65)

    return {
        id,
        objects,
        switches,
        lasers,
        finish
    }
}
