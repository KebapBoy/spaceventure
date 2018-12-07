// Todo: make class static
class Level {
    constructor() {
        this.initialized = false

        this.id = 0
        this.name = undefined
        this.start = undefined
        this.finish = undefined

        this.platforms = []
        this.switches = []
        this.lasers = []

        this.finished = false

        this.startTime = undefined
        this.highscore = undefined
    }

    validateLevelFile(data) {
        if (
            !data || // file is empty
            data.id == undefined || // no id
            !data.name || // no name
            !data.start || !data.start.x == undefined || !data.start.y == undefined || // no(t a valid) start point
            !data.finish || !data.finish.x == undefined || !data.finish.y == undefined// no(t a valid) finish
        ) {
            throw "The level file does not contain valid data."
        }
    }

    // Todo: implement static initialize to create a level class
    initialize(data) {
        this.validateLevelFile(data)

        this.id = data.id
        this.name = data.name
        this.start = new Start(data.start.x, data.start.y)
        this.finish = new Finish(data.finish.x, data.finish.y)

        // create all platforms
        if (Array.isArray(data.platforms)) {
            for (let platformData of data.platforms) {
                if (!platformData) continue

                let platform = new Platform(
                    platformData.x,
                    platformData.y,
                    platformData.w,
                    platformData.h,
                    platformData.landable == true,
                )

                this.platforms.push(platform)
            }
        }

        // create all lasers
        if (Array.isArray(data.lasers)) {
            for (let laserData of data.lasers) {
                if (!laserData) continue

                let laser = new Laser(
                    laserData.x,
                    laserData.y,
                    laserData.length,
                    laserData.name,
                )

                this.lasers.push(laser)
            }
        }

        // create all switches
        if (Array.isArray(data.switches)) {
            for (let switchData of data.switches) {
                if (!switchData) continue

                let _switch = new Switch(
                    switchData.x,
                    switchData.y,
                )

                // connect lasers to the switch
                if (Array.isArray(switchData.connected)) {
                    for (let connected of switchData.connected) {
                        if (!connected) continue

                        let laser = this.lasers.find(laser => laser.name == connected)

                        if (laser) {
                            _switch.connectLaser(laser)
                        }
                    }
                }

                this.switches.push(_switch)
            }
        }

        this.startTime = Date.now()
        this.highscore = getHighscore(this.id)
        this.initialized = true
    }

    reset(resetTime) {
        for (let _switch of this.switches) {
            _switch.deactivate()
        }

        for (let laser of this.lasers) {
            laser.activate()
        }

        this.finished = false

        if (resetTime) {
            this.startTime = Date.now()
            this.highscore = getHighscore(this.id)
        }
    }

    show() {
        this.start.show()
        this.finish.show()

        for (let platform of this.platforms) {
            platform.show()
        }

        for (let _switch of this.switches) {
            _switch.show()
        }

        for (let laser of this.lasers) {
            laser.show()
        }
    }
}
