({
  mainConfigFile: 'requirejs.conf.js',
  paths: {
    almond: 'lib/almond/almond',
    auth: 'lib/livefyre-auth/src/contrib/auth-later',
    'auth/contrib': 'lib/auth/src/contrib'
  },
  baseUrl: '..',
  name: 'collection-feed',
  include: ['almond'],
  out: '../dist/collection-feed.min.js',
  buildCSS: true,
  separateCSS: true,
  preserveLicenseComments: false,
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
