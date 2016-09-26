The repo was created using gulp-angular generator with es6/webpack. The generated code has an issue with karma/instanbul
where it reports ONLY the entry webpack file as source file.

This repo provides a fix to this problem and allow to see the code coverage file by file. 

Here are the steps that were done to sole the issue:

1. Gulp unit test is completly replaced by npm test and npm test:watch scripts
2. webpack configuration for karma.conf is added with isparta-loader for es6 support
3. Add test entry file /src/app/tests.entry.js that import the main app file and use alternative karma-webpack
4. Add webpack preprocessor for /src/app/tests.entry.js in karma.conf

Install and Run:

```
npm install
npm test
open coverage/Chrom*/index.html

```
