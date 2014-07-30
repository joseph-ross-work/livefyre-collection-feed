require.config({
  paths: {
    jquery: 'lib/jquery/jquery',
    base64: 'lib/base64/base64',
    'event-emitter': 'lib/event-emitter/src/event-emitter',
    inherits: 'lib/inherits/inherits',
    md5: 'lib/js-md5/js/md5',
    sinon: 'lib/sinonjs/sinon',
    chai: 'node_modules/chai/chai',
    debug: 'lib/debug/debug',
    'activity-mocks': 'lib/activity-mocks/dist/activity-mocks'
  },
  packages: [{
    name: 'activity-to-content',
    location: 'src'
  },{
    name: 'activity-to-content-tests',
    location: 'test'
  },{
    name: 'streamhub-sdk',
    location: 'lib/streamhub-sdk/src'
  },{
    name: 'streamhub-sdk/content',
    location: 'lib/streamhub-sdk/src/content'
  },{
    name: 'streamhub-sdk/collection',
    location: 'lib/streamhub-sdk/src/collection'
  },{
    name: 'streamhub-sdk/auth',
    location: 'lib/streamhub-sdk/src/auth'
  },{
    name: 'xtend',
    location: 'lib/xtend',
    main: 'index'
  },{
    name: "stream",
    location: "lib/stream/src"
  },{
    name: "auth",
    location: "lib/auth/src"
  }],
  shim: {
    'sinon': {
      exports: 'sinon'
    },
    jquery: {
        exports: '$'
    }
  }
});
