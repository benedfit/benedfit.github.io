module.exports = tasks

var path = require('path')
  , join = path.join
  , glob = require('glob')
  , rmdir = require('rimraf')
  , createConfigury = require('configury')
  , configury = createConfigury('./config.json')
  , config = configury(process.env.NODE_ENV)
  , browserSync = require('browser-sync')
  , src = join(__dirname, config.src)
  , dest = join(__dirname, config.dest)
  , hiddenGlob = join(src, '**/_*')
  , stylusGlob = join(src, '**/*.styl')
  , jadeGlob = join(src, 'views', '**/*.jade')
  , compiledStylesheetsPath = join(src, '_css')
  , pliersImagemin = require('pliers-imagemin')
  , openBrowser = false

function tasks(pliers) {

  // Load pliers plugins
  glob.sync(__dirname + '/pliers/*.js').forEach(function (file) {
    require(file)(pliers, config)
  })

  })

  // Start BrowserSync server
  pliers('start', function (done) {
    var browserSyncConfig = {
      server: {
        baseDir: config.dest
      }
      , open: openBrowser
    }

    browserSync(browserSyncConfig)
    done()
  })

  pliers('watch', function () {

    pliers.watch(pliers.filesets.images, function() {
      pliers.run('imagemin', function () {
        browserSync.reload(pliers.filesets.pages)
      })
    })

    pliers.watch(pliers.filesets.stylus, function () {
      pliers.run('buildCss', function () {
        browserSync.reload(pliers.filesets.pages)
      })
    })

    pliers.watch(pliers.filesets.src, function () {
      pliers.run('buildHtml', function () {
        browserSync.reload(pliers.filesets.pages)
      })
    })

  })

  pliers('go', function () {

    if (process.argv.indexOf('-o') !== -1 || process.argv.indexOf('--open') !== -1) {
      openBrowser = true
    }

    pliers('run', 'build', 'start', 'watch')
    pliers.run('run')

  })

}
