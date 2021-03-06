// Kefir.fromBinder(fn)

function FromBinder(fn) {
  Stream.call(this);
  this._fn = buildFn(fn, 1);
  this._unsubscribe = null;
}

inherit(FromBinder, Stream, {

  _name: 'fromBinder',

  _onActivation: function() {
    var $ = this
      , unsub
      , isCurrent = true
      , emitter = {
        emit: function(x) {  $._send(VALUE, x, isCurrent)  },
        end: function() {  $._send(END, null, isCurrent)  }
      };
    unsub = this._fn(emitter);
    isCurrent = false;
    if (unsub) {
      this._unsubscribe = buildFn(unsub, 0);
    }
  },
  _onDeactivation: function() {
    if (this._unsubscribe !== null) {
      this._unsubscribe();
      this._unsubscribe = null;
    }
  },

  _clear: function() {
    Stream.prototype._clear.call(this);
    this._fn = null;
  }

})

Kefir.fromBinder = function(fn) {
  return new FromBinder(fn);
}






// Kefir.emitter()

function Emitter() {
  Stream.call(this);
}

inherit(Emitter, Stream, {
  _name: 'emitter',
  emit: function(x) {
    this._send(VALUE, x);
    return this;
  },
  end: function() {
    this._send(END);
    return this;
  }
});

Kefir.emitter = function() {
  return new Emitter();
}







// Kefir.never()

var neverObj = new Stream();
neverObj._send(END);
neverObj._name = 'never';
Kefir.never = function() {  return neverObj  }





// Kefir.constant(x)

function Constant(x) {
  Property.call(this);
  this._send(VALUE, x);
  this._send(END);
}

inherit(Constant, Property, {
  _name: 'constant'
})

Kefir.constant = function(x) {
  return new Constant(x);
}

