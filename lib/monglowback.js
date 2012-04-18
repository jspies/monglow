var Mongolian = require('mongolian');


(function(){
  var initializing = false;

  // The base Class implementation (does nothing)
  this.Class = function(){};

  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
    
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = (typeof prop[name] == "function" && 
        typeof _super[name] == "function" && /\b_super\b/.test(prop[name]) ) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
            
            // Add a new ._super() method that is the same method but on the super-class
            this._super = _super[name];
            
            // The method only need to be bound temporarily, so we remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
            
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
    
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
    
    // Populate our constructed prototype object
    Class.prototype = prototype;
    
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;
    Class.statics = function(methods) {
      var _super = this.prototype;
      for (var name in methods) {
        this[name] = methods[name];
      }
    }

    // Copy static methods
    for (var name in this) {
      if (name != "extend" && name != "statics") {
        Class[name] = this[name];
      }
    }
    
    return Class;
  };
})();


var Client;
var Monglow = Class.extend({
  init: function(name) {
    this.connect();
  },

  connect: function(server_string) {
    // needs to get settings out of a file
    if (server_string == null) server_string = "mongo://127.0.0.1:27017/monglow_test";
    Client = new Mongolian(server_string);
  },

  close: function() {
    Client.close();
  },

  model: function(name) {
    var Model = MonglowModel.extend(function() {});
    Model.statics({model_name: name});
    return Model;
  }
})


//---------- Model -----------------
var MonglowModel = Class.extend({
  init: function(params) {
    console.log("MODEL " + this.model_name);
  },

  save: function() {
    //Client.collection(this.model_name)
  }
});
MonglowModel.statics({
  find: function() {
    var req = Client.collection(this.model_name).find();
    return req.toArray(function(err, items) {console.log(items)});
  }
});


module.exports = new Monglow();