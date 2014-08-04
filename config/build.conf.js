({
  mainConfigFile: 'requirejs.conf.js',
  paths: {
    almond: 'lib/almond/almond',
    auth: 'lib/livefyre-auth/src/contrib/auth-later',
    'auth/contrib': 'lib/auth/src/contrib'
  },
  baseUrl: '..',
  name: 'collection-feed',
  include: ['almond', 'css'],
  exclude: ['css/normalize', 'less/normalize'],
  stubModules: ['text', 'hgn', 'json'],
  out: '../dist/collection-feed.min.js',
  buildCSS: true,
  separateCSS: true,
  preserveLicenseComments: false,
  pragmasOnSave: {
    excludeHogan: true,
    excludeRequireCss: true
  },
  optimize: 'none',
  cjsTranslate: true,
  uglify2: {
    compress: {
      unsafe: true
    },
    mangle: true
  },
  wrap: {
    startFile: 'wrap-start.frag',
    endFile: 'wrap-end.frag'
  },
  generateSourceMaps: true
})
