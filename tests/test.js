/*
  Unit tests for Array2d.
*/


var _ = require('./underscore');
var should = require('./chai').should();
var Array2d = require('../arr2d');

/*
  Used to render functions that throw and error testable.

  Usage:
  var add = function(x, y) {return x + y;};
  var fn = compose(add)(2, 3);
  fn() -> 6
*/
var compose = function(fn, context) {
  return function() {
    var args = arguments;
    return function() {return fn.apply(context, args);};
  };
};

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

  it("should confirm obj is empty.", function() {
    var arr = obj(0, 0);
    arr.isEmpty().should.be.true;
  });

  it("should check .get for bounds.", function() {
    var arr = obj(2, 3);
    arr.get([0, 0]);
    arr.get([0, 1]);
    arr.get([1, 0]);
    arr.get([1, 2]);
    compose(arr.get, arr)([0, -1]).should.throw();
    compose(arr.get, arr)([2, 3]).should.throw();
    compose(arr.get, arr)([0, -1]).should.throw();
  });

  it("should set a position.", function() {
    var arr = obj(2, 3);
    arr.set([0, 0], 'foo');
    arr.get([0, 0]).should.eql('foo');
    arr.set([1, 1], 'bar');
    arr.get([1, 1]).should.eql('bar');
    arr.set([1, 2], 'qux');
    arr.get([1, 2]).should.eql('qux');
    // Make sure [0, 0] wasn't overwritten somehow.
    arr.set([0, 0], 'foo');
    arr.get([0, 0]).should.eql('foo');
  });

  it("should set given an index argument.", function() {
    var arr = obj(3, 4);
    arr.set(11, 'foobar');
    arr.arr[11].should.eql('foobar');
    arr.get(11).should.eql('foobar');
    arr.get([2, 3]).should.eql('foobar');
    arr.set(0, 'qux');
    arr.get(0).should.eql('qux');
  });

  it("should get an empty position.", function() {
    var arr = obj(2, 3);
    arr.isEmptyAt([0, 0]).should.be.true;
    compose(arr.isEmptyAt, arr)([5, 5]).should.throw();
    arr.isEmptyAt([1, 2]).should.be.true;
    arr.set([1, 2], 'foobar').isEmptyAt([1, 2]).should.be.false;
    arr.set([1, 2], undefined).isEmptyAt([1, 2]).should.be.true;
    arr.set([1, 2], null).isEmptyAt([1, 2]).should.be.false;
  });

  it("should convert a position coordinate to an array index.", function() {
    var arr = obj(3, 4);
    arr.posToIndex([0, 0]).should.eql(0);
    arr.posToIndex([0, 3]).should.eql(9);
    arr.posToIndex([1, 3]).should.eql(10);
    arr.posToIndex([2, 3]).should.eql(11);
  });

  it("should convert a an array index to a position coordinate.", function() {
    var arr = obj(3, 4);
    arr.indexToPos(0).should.eql([0, 0]);
    arr.indexToPos(9).should.eql([0, 3]);
    arr.indexToPos(10).should.eql([1, 3]);
    arr.indexToPos(11).should.eql([2, 3]);
  });

  it("should check if a position is empty given a condition.", function() {
    var arr = obj(2, 3);
    arr.set([1, 2], 'foo');
    // Suppose we want 'foo' values to be considered empty.
    arr.isEmptyAt([1, 2], function(val) {
      return val == 'foo';
    }).should.be.true;
    arr.set([1, 2], 'bar').isEmptyAt([1, 2]).should.be.false;
  });

  it("should test .fill and .clear", function() {
    var arr = obj(2, 3);
    arr.fill('a');
    _.every(arr.arr, function(val) {
      return val == 'a';
    }).should.be.true;
    arr.clear();
    _.every(arr.arr, function(val) {
      return val === undefined;
    }).should.be.true;
  });

  it("should call .fill with a function argument.", function() {
    var arr = obj(3, 4).fill(function(pos) {
      return pos;
    });
    for (var i=0; i < arr.len(); i++)
      _.isEqual(arr.get(i), arr.indexToPos(i)).should.be.true;
  });

  it("should inject a value into the first empty position.", function() {
    var arr = obj(3, 4);
    arr.set([0, 0], 'foo');
    arr.set([1, 0], 'foo');
    arr.inject('bar');
    arr.get([1, 0]).should.eql('foo');
    arr.get([2, 0]).should.eql('bar');
    arr.inject('qux');
    arr.get([0, 1]).should.eql('qux');
  });

  it("should throw on attempting to inject into a full array.", function() {
    var arr = obj(2, 1);
    arr.set(0, 'foo');
    arr.set(1, 'foo');
    compose(arr.inject, arr)('foo').should.throw();
  });

});
