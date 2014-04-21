var cov = (!! process.env.cov);
var fast = (!! process.env.fast);

// Deps
global.chai = require('chai');
global.expect = require('chai').expect;
chai.should();

var fs = require('fs');
var multisuite = require('./support/multisuite');

var scripts = {
  'jq-1.7': fs.readFileSync('vendor/jquery-1.7b2.js'),
  'jq-2.0': fs.readFileSync('vendor/jquery-2.0.2.js'),
  'navstack': fs.readFileSync('navstack.js')
};

function myEnv(jq) {
  var jsdom = require('jsdom');
  return function(done) {
    jsdom.env({
      html: '<!doctype html>',
      src: [ scripts[jq], scripts.navstack ],
      done: function(errors, window) {
        if (errors) {
          errors.forEach(function (e) { console.error(e.data); });
          return done(errors[0].data.error);
        }
        window.navigator.test = true;

        window.console = console;
        global.window  = window;
        global.$       = window.$;
        global.jQuery  = window.jQuery;
        global.Ractive = window.Ractive;
        global.Navstack = window.Navstack;
        // window._$jscoverage = global._$jscoverage;
        global._$jscoverage = window._$jscoverage;

        chai.use(require('chai-jquery'));
        done();
      }
    });
  };
}

if (!cov && !fast) {
  global.testSuite = function(name, fn) {
    describe("jq-1.7: "+name, function () {
      before(myEnv('jq-1.7'));
      fn();
    });
    describe("jq-2.0: "+name, function () {
      before(myEnv('jq-2.0'));
      fn();
    });
  };
} else {
  before(myEnv('jq-2.0'));
  global.testSuite = describe;
}

beforeEach(function () {
  global.sinon = require('sinon').sandbox.create();
});

afterEach(function () {
  global.sinon.restore();
});

// Reset when needed
beforeEach(function () {
  $('body').html('');
});