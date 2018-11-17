
/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are different from default.
 |
 |
 */
module.exports = {
    "watch": true,
    "server": {
        baseDir: "./src",
        routes: {
            "/vendor": "./node_modules",
        },
    },
    "port": 8080,
}
