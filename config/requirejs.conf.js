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
    'activity-mocks': 'lib/activity-mocks/dist/activity-mocks',
    hgn: 'lib/requirejs-hogan-plugin/hgn',
    hogan: 'lib/hogan/web/builds/2.0.0/hogan-2.0.0.amd',
    text: 'lib/requirejs-text/text',
    'mout': 'lib/mout/src',
    'chronos-stream': 'lib/chronos-stream/dist/chronos-stream',
    'auth-interface': 'lib/auth-interface/index',
    'stream-client': 'node_modules/livefyre-stream-client/src/StreamClient',
    'sockjs-client': 'node_modules/livefyre-stream-client/node_modules/sockjs-client/sockjs',
    'events-event-emitter': 'node_modules/livefyre-stream-client/node_modules/events-event-emitter/src/event-emitter',
    'util-extend': 'node_modules/livefyre-stream-client/node_modules/util-extend/extend',
    json: 'lib/requirejs-plugins/src/json',
    rework: 'lib/rework/rework',
    'observer': 'lib/observer/src/observer'
  },
  packages: [{
    name: 'collection-feed',
    location: 'src'
  },{
    name: 'collection-feed-tests',
    location: 'test'
  },{
    name: 'streamhub-sdk',
    location: 'lib/streamhub-sdk/src'
  },{
    name: 'streamhub-sdk/content',
    location: 'lib/streamhub-sdk/src/content'
  },{
    name: 'streamhub-sdk/modal',
    location: 'lib/streamhub-sdk/src/modal'
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
  },{
    name: "livefyre-auth",
    location: "lib/livefyre-auth/src"
  },{
    name: 'view',
    location: 'lib/view/src',
    main: 'view'
  },{
    name: 'streamhub-share',
    location: 'lib/streamhub-share/src',
    main: 'share-button.js'
  },{
    name: 'streamhub-feed',
    location: 'lib/streamhub-feed/src'
  },{
    name: "streamhub-feed/styles",
    location: "lib/streamhub-feed/src/css"
  },{
    name: 'thread',
    location: 'lib/thread/src'
  },{
    name: 'streamhub-ui',
    location: 'lib/streamhub-ui/src'
  },{
    name: "livefyre-bootstrap",
    location: "lib/livefyre-bootstrap/src"
  },{
    name: "less",
    location: "lib/require-less",
    main: "less"
  },{
    name: "css",
    location: "lib/require-css",
    main: "css"
  },{
    name: "streamhub-editor",
    location: "lib/streamhub-editor/src/javascript"
  },{
   name: 'streamhub-editor/styles',
   location: 'lib/streamhub-editor/src/styles'
  },{
    name: "streamhub-editor/templates",
    location: "lib/streamhub-editor/src/templates"
  },{
    name: 'livefyre-package-attribute',
    location: 'lib/livefyre-package-attribute/src'
  }],
  shim: {
    'sinon': {
      exports: 'sinon'
    },
    jquery: {
        exports: '$'
    },
    'sockjs-client': {
        exports: 'SockJS'
    },
    rework: {
      exports: 'rework'
    }
  },
  css: {
    clearFileEachBuild: 'dist/collection-feed.min.css',
    transformEach: {
      requirejs: 'lib/livefyre-package-attribute/tools/prefix-css-requirejs',
      node: 'lib/livefyre-package-attribute/tools/prefix-css-node'
    }
  },
  less: {
    browserLoad: 'dist/collection-feed.min',
    paths: ['lib'],
    relativeUrls: true,
    modifyVars: {
      '@icon-font-path': "\"http://cdn.livefyre.com/libs/livefyre-bootstrap/v1.1.0/fonts/\""
    }
  }
});
