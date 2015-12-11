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

it("Should return true on inside bounds.", function() {
  var arr = obj(2, 3);
  arr.isBounded([0, 0]).should.be.true;
  arr.isBounded([0, 1]).should.be.true;
  arr.isBounded([1, 0]).should.be.true;
  arr.isBounded([1, 2]).should.be.true;
});

it("Should return false on outside bounds.", function() {
  var arr = obj(2, 3);
  arr.isBounded([-1, 0]).should.be.false;
  arr.isBounded([0, -1]).should.be.false;
  arr.isBounded([2, 3]).should.be.false;
});

it("Should return check if obj is empty.", function() {
  var arr = obj(0, 0);
  arr.isEmpty().should.be.true;
});
