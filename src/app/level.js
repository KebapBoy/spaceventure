class Level {
    constructor(data) {
        this.valid = this._validateLevelFile(data)
        if (!this.valid) return

        this.name = undefined
        this.start = undefined
        this.finish = undefined

        this.platforms = []
        this.switches = []
        this.lasers = []

        this.hints = []

        this.finished = false

        this.highscore = undefined
        this.startTime = undefined
        this.endTime = undefined

        this.initialized = false
        this._initialize(data)
    }

    reset(resetTime) {
        for (const _switch of this.switches) {
            _switch.deactivate()
        }

        for (const laser of this.lasers) {
            laser.activate()
        }

        this.finished = false

        if (resetTime) {
            this.startTime = Date.now()
            this.endTime = undefined
        }
    }

    saveHighscore() {
        if (!this.startTime || !this.endTime) return

        const newHighscore = currentLevel.endTime - currentLevel.startTime

        if (!this.highscore || newHighscore < this.highscore) {
            storeHighscore(this.name, newHighscore)
            this.highscore = newHighscore
        }
    }

    show() {
        for (const hint of this.hints) {
            hint.show()
        }

        this.start.show()
        this.finish.show()

        for (const platform of this.platforms) {
            platform.show()
        }

        for (const _switch of this.switches) {
            _switch.show()
        }

        for (const laser of this.lasers) {
            laser.show()
        }
    }

    _validateLevelFile(data) {
        return data && // file is empty
            data.name && // no name
            data.start && data.start.x != undefined && data.start.y != undefined && // no(t a valid) start point
            data.finish && data.finish.x != undefined && data.finish.y != undefined// no(t a valid) finish
    }

    _initialize(data) {
        this.name = data.name
        this.start = new Start(data.start.x, data.start.y)
        this.finish = new Finish(data.finish.x, data.finish.y)

        // create all platforms
        if (Array.isArray(data.platforms)) {
            for (const platformData of data.platforms) {
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
            for (const laserData of data.lasers) {
                if (!laserData) continue

                let laser = new Laser(
                    laserData.x,
                    laserData.y,
                    laserData.length,
                    laserData.name,
                    laserData.socket,
                )

                this.lasers.push(laser)
            }
        }

        // create all switches
        if (Array.isArray(data.switches)) {
            for (const switchData of data.switches) {
                if (!switchData) continue

                let _switch = new Switch(
                    switchData.x,
                    switchData.y,
                )

                // connect lasers to the switch
                if (Array.isArray(switchData.connected)) {
                    for (const connected of switchData.connected) {
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

        // create all hints
        if (Array.isArray(data.hints)) {
            for (const hintData of data.hints) {
                if (!hintData) continue

                let hint = new TutorialHint(
                    hintData.x,
                    hintData.y,
                    hintData.text,
                )

                this.hints.push(hint)
            }
        }

        this.highscore = getHighscore(this.name)
        this.startTime = Date.now()

        this.initialized = true
    }
}
