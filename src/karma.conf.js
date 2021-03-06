// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    //frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-selenium-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karam-spec-reporter')
    ],
    hostname: 'angulartestkarma',
    client: {
      clearContext: false
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../coverage'),
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true,
      reporters: ['coverage'],
      preprocessors: { 'src/app/*ts' : 'covrage' }
    },
    angularCli: {
      enviroment: 'dev'
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    customLaunchers: {
      selenium: {
        base: 'selenium',
        browserName: 'Chrome',
        getDriver: function () {
          return new webDriver.Builder()
          .forBrowser('Chrome')
          .usingServer('http//localhost:4444/wd/hub')
          .build()
        },
      }
    },
    singleRun: false
  });
};
