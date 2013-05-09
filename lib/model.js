var MonglowModel = (function() {

  MonglowModel.name = 'MonglowModel';

  function MonglowModel() {
    Object.defineProperty(this, "model_name", {enumerable: false});
    Object.defineProperty(this, "client", {enumerable: false});
    Object.defineProperty(this, "references_many", {enumerable: false});
  }

  MonglowModel.find = function(options, projection, callback) {
    if (typeof(options) == "function" && !callback) {
      callback = options;
      options = {};
    } else if (typeof(projection) == "function" && !callback) {
      callback = projection;
      projection = {};
    }
    var self = this;
    var req = this.client.collection(this.model_name).find(options, projection);
    return req.toArray(function(err, items) {
      var item, model, objects, _i, _len;
      objects = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        model = new self.model(item);
        model.model_name = self.model_name;
        objects.push(model);
      }
      if (callback) {
        return callback(err, objects);
      }
    });
  };

  MonglowModel.findOne = function(options, callback) {
    if (typeof(options) == "function") {
      callback = options;
      options = {};
    }
    var self = this;
    var request = this.client.collection(this.model_name).findOne(options, function(err, result) {
      if (result) {
        var model = new self.model(result);
        model.model_name = self.model_name;
        callback(err, model);
      } else {
        callback();
      }
    });
  }

  return MonglowModel;
})();

Object.defineProperty(MonglowModel.prototype, "save", {
  value: function(attributes, callback) {
    var self = this;
    if (typeof attributes === "function") {
      callback = attributes;
      attributes = {};
    }

    var to_save = this.fields(attributes);

    return this.client.collection(this.model_name).save(to_save, function(err, result) {
      if (err) {

      } else {
        self._id = result._id;
      }
      if (callback) {
        return callback(err, result);
      }
    });
  }
});

Object.defineProperty(MonglowModel.prototype, "fields", {
  value: function(attributes) {
    var _fields = {};
    for (var name in this) {
      var value = this[name];
      if (name !== "constructor" && typeof value != "function") {
        _fields[name] = value;
        if (attributes && attributes[name]) {
          _fields[name] = attributes[name]; // Updating the value
        }
      }
    }
    return _fields;
  }
});

Object.defineProperty(MonglowModel.prototype, "remove", {
  value: function() {
    if (this._id) {
      return this.client.collection(this.model_name).remove({
        _id: this._id
      });
    }
  },
  enumerable: false
});

module.exports = MonglowModel;