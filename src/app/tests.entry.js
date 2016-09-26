import './index.module';

// read https://github.com/webpack/karma-webpack
var testsContext = require.context("./", true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);
