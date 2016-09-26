'use strict';

var path = require('path');
var conf = require('./gulp/conf');

var _ = require('lodash');
var wiredep = require('wiredep');

var pathSrcHtml = [
  path.join(conf.paths.src, '/**/*.html')
];

function listFiles() {
  var wiredepOptions = _.extend({}, conf.wiredep, {
    dependencies: true,
    devDependencies: true
  });

  var patterns = wiredep(wiredepOptions).js
  // FIX-C
    .concat([
      './src/app/tests.entry.js'
    ])
    .concat(pathSrcHtml);

  var files = patterns.map(function (pattern) {
    return {
      pattern: pattern
    };
  });
  files.push({
    pattern: path.join(conf.paths.src, '/assets/**/*'),
    included: false,
    served: true,
    watched: false
  });
  console.log(files);
  return files;
}

module.exports = function (config) {
  // FIX-C
  var coverage = config.singleRun ? ['coverage'] : [];

  var configuration = {
    files: listFiles(),

    // FIX-C
    autoWatch: true,

    ngHtml2JsPreprocessor: {
      stripPrefix: conf.paths.src + '/',
      moduleName: 'gulpAngularEs6'
    },

    logLevel: 'WARN',

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    plugins: [
      'karma-coverage',
      'karma-jasmine',
      'karma-webpack',
      'karma-ng-html2js-preprocessor',
      'karma-spec-reporter',
      'karma-chrome-launcher'
    ],

    coverageReporter: {
      reporters: [
        {
          type: 'html',
          dir: 'coverage/'
        },
        {type: 'json', subdir: '.'},
        {type: 'cobertura', subdir: '.', file: 'cobertura.txt'},
        {type: 'text'}
      ]
    },

    // FIX-C
    reporters: ['spec'].concat(coverage),

    proxies: {
      '/assets/': path.join('/base/', conf.paths.src, '/assets/')
    },

    webpackMiddleware: {
      noInfo: true
    },

    // FIX-C
    webpack: {
      devtool: 'inline-source-map',
      isparta: {
        embedSource: true,
        noAutoWrap: true,
        babel: {
          presets: ['es2015']
        }
      },
      module: {
        loaders: [
          {
            test: /tests.entry.js$/,
            exclude: /(node_modules|bower_components)/,
            loaders: ['ng-annotate', 'babel-loader?presets[]=es2015']
          },
          {
            test: /\.spec.js$/,
            exclude: /(node_modules|bower_components)/,
            loaders: ['ng-annotate', 'babel-loader?presets[]=es2015']
          },
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components|spec.js)/,
            loader: 'isparta'
          }

        ]
      }
    }
  };

  // This is the default preprocessors configuration for a usage with Karma cli
  // The coverage preprocessor is added in gulp/unit-test.js only for single tests
  // It was not possible to do it there because karma doesn't let us now if we are
  // running a single test or not
  configuration.preprocessors = {};
  // FIX-C
  configuration.preprocessors['./src/app/tests.entry.js'] = ['webpack'];
  pathSrcHtml.forEach(function (path) {
    configuration.preprocessors[path] = ['ng-html2js'];
  });

  // This block is needed to execute Chrome on Travis
  // If you ever plan to use Chrome and Travis, you can keep it
  // If not, you can safely remove it
  // https://github.com/karma-runner/karma/issues/1144#issuecomment-53633076
  if (configuration.browsers[0] === 'Chrome' && process.env.TRAVIS) {
    configuration.customLaunchers = {
      'chrome-travis-ci': {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    };
    configuration.browsers = ['chrome-travis-ci'];
  }

  config.set(configuration);
};
