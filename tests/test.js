var should = require('./chai').should();

function assert(cond, obj) {
  console.assert(cond, Array.prototype.slice(arguments, 1));
}

/*
  Usage:
  var spy = createSpy();
  spy();
  spy();
  assert(spy.count() == 2);     // True
 */
function createSpy() {
  var n = 0;
  function invoke() {n += 1;}
  invoke.count = function() {return n;};
  return invoke;
}

it("Should do something", function() {
  // throw Error('bad');
  // assert(true, 'bad');
});
