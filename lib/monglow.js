(function() {
  var Monglow, MonglowModel, Mongolian,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Mongolian = require("mongolian");

  Monglow = (function() {

    function Monglow() {
      this.Client = this.connect();
      this.Client.collection("posts").find();
    }

    Monglow.prototype.connect = function() {
      var server_string;
      if (!server_string) server_string = "mongo://127.0.0.1:27017/monglow_test";
      return new Mongolian(server_string);
    };

    Monglow.prototype.close = function() {
      return this.Client.close();
    };

    Monglow.prototype.model = function(name) {
      var Model, model_name, that;
      that = this;
      model_name = name;
      Model = (function(_super) {

        __extends(Model, _super);

        Model.model_name = name;

        Model.client = that.Client;

        Model.model = Model;

        function Model(params) {
          var name, value;
          this.model_name = model_name;
          this.client = that.Client;
          for (name in params) {
            value = params[name];
            if (!this[name]) this[name] = value;
          }
          Model.__super__.constructor.call(this, params);
        }

        return Model;

      })(MonglowModel);
      return Model;
    };

    return Monglow;

  })();

  MonglowModel = (function() {

    function MonglowModel() {
      this.restrictedFields = ['remove', '_raw', 'model', 'update', 'save', 'create', 'constructor', 'fields', 'restrictedFields', 'client', 'model_name'];
    }

    MonglowModel.prototype.save = function(callback) {
      var self;
      self = this;
      return this.client.collection(this.model_name).save(this.fields(true), function(err, result) {
        if (err) {} else {
          self._id = result._id;
        }
        if (callback) return callback(err, result);
      });
    };

    MonglowModel.prototype.remove = function() {
      if (this._id) {
        return this.client.collection(this.model_name).remove({
          _id: this._id
        });
      }
    };

    MonglowModel.prototype.fields = function(raw) {
      var name, value, _fields;
      _fields = {};
      for (name in this) {
        value = this[name];
        if (this.restrictedFields.indexOf(name) === -1) _fields[name] = value;
      }
      if (raw && this.raw) _fields._id = this.raw._id;
      console.log(_fields);
      return _fields;
    };

    MonglowModel.references_many = function(ref_name) {
      if (!this.many_references) this.many_references = [];
      return this.many_references.push(ref_name);
    };

    MonglowModel.find = function(callback) {
      var req, self;
      self = this;
      req = this.client.collection(this.model_name).find();
      return req.toArray(function(err, items) {
        var item, model, objects, _i, _len;
        objects = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          model = new self.model(item);
          model._raw = item;
          model.model_name = self.model_name;
          objects.push(model);
        }
        if (callback) return callback(err, objects);
      });
    };

    return MonglowModel;

  })();

  module.exports = new Monglow;

}).call(this);
