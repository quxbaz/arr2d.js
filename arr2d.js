/*
  arr2d.js

  2d array class

  Usage:
  <todo>

*/


/*
  TODO:
  Add row/column functions.
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
  };

  var fn = Array2d.prototype;

  /*
    Decorates a method so that its position argument is required to be
    bound by the size of its internal array.
  */
  var bound = function(f) {
    // @pos: An array of the form [x, y].
    return function(pos) {
      if (typeof pos.length === 'undefined' || pos.length < 2)
        throw 'First argument must be an array of the form [x, y].';
      var bounded = fn.isBounded.call(this, pos);
      if (bounded)
        return f.apply(this, arguments);
      else
        throw 'Position exceeds array bounds.';
    };
  };

  fn.isEmpty = bound(function(pos, cond) {
    var val = this.get(pos);
    return cond ? cond(val) : (val ? false : true);
  });

  fn.isBounded = function(pos) {
    var x = pos[0];
    var y = pos[1];
    return (
      x >= 0 && x < this.w &&
      y >= 0 && y < this.h
    );
  };

  fn.len = function() {
    return this.arr.length;
  };

  fn.get = bound(function(pos) {
    // if (typeof pos === 'number')
    //     return this.arr[pos];
    var i = pos[1] * this.w + pos[0];
    return this.arr[i];
  });

  fn.set = bound(function(pos, val) {
    var i = pos[1] * this.w + pos[0];
    this.arr[i] = val;
    return this;
  });

  fn.clear = function() {
    for (var i=0; i < this.arr.length; i++)
      this.arr[i] = undefined;
  };

  // TODO: Add count option.
  fn.inject = function(obj) {
    /*
      Adds an object to the first undefined position in the
      array. Returns this to allow chaining. Throws an error if
      the array is completely filled.
    */

    var len = this.w * this.h;
    for (var i=0; i < len; i++) {
      if (typeof this.arr[i] == 'undefined') {
        this.arr[i] = obj;
        return this;
      }
    }
    throw 'Array is already filled to max capacity.';
  };

  // TODO
  fn.fill = function(obj) {

  };

  fn.iter = function(iter, context) {
    /*
      Applies the function iter through each element of the
      array. iter takes the following arguments:

      iter(i, x, y, obj, set)
    */

    var arr = this.arr;

    var setf = function(i) {
      return function(v) {
        arr[i] = v;
      }
    };

    for (var i=0; i < this.len(); i++) {
      var x = i % this.w;
      var y = Math.floor(i / this.w);
      if (typeof context === 'undefined')
        iter(i, x, y, this.arr[i], setf(i));
      else
        iter.call(context, i, x, y, this.arr[i], setf(i));
    }

    return this;
  };

  fn.print = function(opts) {
    /*
      Prints out the array as a matrix.

      Parameters:

      @opts

      repr [optional]:
      A function called on each object. The return value of the
      function is used as output.

      sep [optional]:
      A separator string used in between each printed element.

      empty [optional]:
      A default string to use when the array element is undefined.
    */

    var opts   = opts || {};
    var sep    = opts.sep || ' ';
    var empty  = opts.empty || ' ';
    var buffer = [];
    this.iter(function(i, x, y, obj) {
      if (typeof obj == 'undefined')
        buffer.push(empty);
      else {
        if (opts.repr)
          buffer.push(opts.repr(obj));
        else
          buffer.push(obj);
      }
      if (x == this.w - 1) {
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
