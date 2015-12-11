/*
  Unit tests for Array2d.
*/


var should = require('./chai').should();
var Array2d = require('../arr2d');

// Make a test object; saves on typing.
function obj(w, h) {
  var w = w | 0;
  var h = h | 0;
  return new Array2d(w, h);
}

it("Should create an Array2d instance with no parameters.", function() {
  var arr = obj();
  arr.len().should.eql(0);
});

it("Should create an Array2d instance with width and height.", function() {
  obj(2, 3);
});

it("Should confirm length.", function() {
  var arr = obj(2, 3);
  arr.len().should.be.eql(6);
});

it("Should check bounds.", function() {
  var arr = obj();
  arr.isBounded([0, 0]).should.be.true;
});
