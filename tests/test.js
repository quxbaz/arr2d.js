/*
  Unit tests for Array2d.
*/


var should = require('./chai').should();
var Array2d = require('../arr2d');

/*
  Used to render functions that throw and error testable.

  Usage:
  var add = function(x, y) {return x + y;};
  var fn = compose(add)(2, 3);
  fn() -> 6
*/
function compose(fn, context) {
  return function() {
    return fn.apply(context, arguments);
  }
}

// Make a test object; saves on typing.
function obj(w, h) {
  var w = w | 0;
  var h = h | 0;
  return new Array2d(w, h);
}

describe('Array2d', function() {

  it("should create an instance with no parameters.", function() {
  var arr = obj();
    arr.len().should.eql(0);
  });

  it("should create an instance with width and height.", function() {
    obj(2, 3);
  });

  it("should confirm length.", function() {
    var arr = obj(2, 3);
    arr.len().should.be.eql(6);
  });

  it("should return true on inside bounds.", function() {
    var arr = obj(2, 3);
    arr.isBounded([0, 0]).should.be.true;
    arr.isBounded([0, 1]).should.be.true;
    arr.isBounded([1, 0]).should.be.true;
    arr.isBounded([1, 2]).should.be.true;
  });

  it("should return false on outside bounds.", function() {
    var arr = obj(2, 3);
    arr.isBounded([-1, 0]).should.be.false;
    arr.isBounded([0, -1]).should.be.false;
    arr.isBounded([2, 3]).should.be.false;
  });

  it("should return check if obj is empty.", function() {
    var arr = obj(0, 0);
    arr.isEmpty().should.be.true;
  });

  it("should check .get for bounds.", function() {
    var arr = obj(2, 3);
    arr.get([0, 0]);
    arr.get([0, 1]);
    arr.get([1, 0]);
    arr.get([1, 2]);
    arr.get([-1, 0]);
    // arr.get([0, -1]).should.throw();
    // arr.get([2, 3]).should.throw();
  });

});
