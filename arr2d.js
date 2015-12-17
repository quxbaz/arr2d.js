/*
  arr2d.js

  2d array class

  Usage:

  var arr = new Array2d(3, 4);
  arr.len();                    // 12

  arr.set([1, 2], 'x');
  arr.get([1, 2]);              // 'x'

  arr.fill('z');
  arr.get([1, 2]);              // 'z'
*/


module.exports = (function() {

  function Array2d(w, h) {
    /*
      Internally, this structure uses  a flat array.
    */
    this.w = w || 0;
    this.h = h || 0;
    this.arr = [];
    this.arr.length = this.w * this.h;
    this.fill(undefined);
  };

  var fn = Array2d.prototype;

  Object.defineProperty(fn, 'rows', {
    get: function() {
      var rows = [];
      var len = this.len();
      for (var i=0; i < len; i += this.w)
        rows.push(this.arr.slice(i, i + this.w));
      return rows;
    }
  });

  var bound = function(f) {
    /*
      Decorates a method so that its position argument is required to be
      bound by the size of its internal array.
    */
    return function(pos) {
      // @pos: An index or array of the form [x, y].
      var bounded = fn.isBounded.call(this, pos);
      if (bounded)
        return f.apply(this, arguments);
      else
        throw Error('Position exceeds array bounds.');
    };
  };

  fn.isBounded = function(pos) {
    if (typeof pos == 'number')
      return pos < this.len();
    else
      return (
        pos[0] >= 0 && pos[0] < this.w &&
        pos[1] >= 0 && pos[1] < this.h
      );
  };

  fn.len = function() {
    return this.arr.length;
  };

  fn.isEmpty = function() {
    return this.len() == 0;
  };

  fn.posToIndex = function(pos) {
    return pos[1] * this.w + pos[0];
  };

  fn.indexToPos = function(index) {
    var x = index % this.w;
    var y = Math.floor(index / this.w);
    return [x, y];
  };

  // Unbound function for optimization. Avoids redundancy when the
  // outer function is already bound.
  fn._get = function(pos) {
    if (typeof pos == 'number')
      return this.arr[pos];
    else
      return this.arr[this.posToIndex(pos)];
  };

  fn._set = function(pos, val) {
    if (typeof pos == 'number')
      this.arr[pos] = val;
    else
      this.arr[this.posToIndex(pos)] = val;
    return this;
  };

  fn.get = bound(function() {
    return this._get.apply(this, arguments);
  });

  fn.set = bound(function() {
    return this._set.apply(this, arguments);
  });

  fn.isEmptyAt = bound(function(pos, cond) {
    // The value undefined is considered empty if no condition is
    // provided.
    var val = this._get(pos);
    return cond ? cond(val) : typeof val === 'undefined';
  });

  fn.clear = function() {
    var len = this.len();
    for (var i=0; i < len; i++)
      this.set(i, undefined);
    return this;
  };

  fn.addRows = function(nRows) {
    for (var i=0; i < this.w * nRows; i++)
      this.arr.push(undefined);
    this.h += nRows;
    return this;
  };

  fn.addCols = function(nCols) {
    var newArr = new Array((this.w + nCols) * this.h);
    var map = [];
    this.iter(function(val, pos, i) {
      map.push(function() {
        this.set(pos, val);
      }.bind(this));
    });
    this.w += nCols;
    this.arr = newArr;
    for (var i=0; i < map.length; i++)
      map[i]();
    return this;
  };

  fn.fill = function(val) {
    /*
      @val: A value or function. If a function is given, the current
      position being filled will be passed to it during iteration.
    */
    var len = this.len();
    for (var i=0; i < len; i++)
      this.set(i, typeof val == 'function' ? val(this.indexToPos(i)) : val);
    return this;
  };

  fn.inject = function(val) {
    /*
      Adds an object to the first empty (ie, undefined) position in
      the array. Throws an error if the array is completely filled.
    */
    var len = this.len();
    for (var i=0; i < len; i++) {
      if (this.isEmptyAt(i))
        return this.set(i, val);
    }
    throw Error('Array is completely filled.');
  };

  fn.iter = function(fn, context) {
    /*
      Applies @fn through each element of the array.
      @fn is provided the following arguments:
        fn(val, [x, y], index)
      @context: The context @fn is bound to. The default context is
      set to 'this'.
    */
    if (typeof context == 'undefined')
      var context = this;
    for (var i=0; i < this.len(); i++)
      fn.call(context, this.get(i), this.indexToPos(i), i);
    return this;
  };

  fn.print = function(opts) {
    /*
      Prints out the array as a matrix.

      @opts:
      |
      | repr [optional]:
      | A function called on each object. The return value of the
      | function is used as output. Also accepts a string.
      |
      | sep [optional]:
      | A separator string used in between each printed element.
      |
      | empty [optional]:
      | A default string to use when the array element is undefined.
    */
    var opts   = opts || {};
    var sep    = opts.sep || ' ';
    var empty  = opts.empty || '-';
    var buffer = [];
    this.iter(function(val, pos, i) {
      if (this.isEmptyAt(i))
        buffer.push(empty);
      else {
        var repr = opts.repr;
        if (repr)
          buffer.push(typeof repr == 'string' ? repr : opts.repr(val));
        else
          buffer.push(val);
      }
      if (pos[0] == this.w - 1) {
        console.log(buffer.join(sep));
        buffer.length = 0;
      }
    }, this);
    if (buffer.length > 0)
      console.log(buffer.join(sep));
    return this;
  };

  return Array2d;

})();
