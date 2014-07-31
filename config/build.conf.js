({
  mainConfigFile: 'requirejs.conf.js',
  paths: {
    almond: 'lib/almond/almond'
  },
  baseUrl: '..',
  name: 'collection-as-content',
  include: ['almond'],
  out: '../dist/collection-as-content.min.js',
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
