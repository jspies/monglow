Mongolian = require("mongolian")

class Monglow
  constructor: () ->
    this.Client = this.connect()
    this.Client.collection("posts").find()
  connect: ->
    if !server_string
      server_string = "mongo://127.0.0.1:27017/monglow_test"
    new Mongolian(server_string)
  close: ->
    this.Client.close()

  model: (name) ->
    that = this
    model_name = name
  
    class Model extends MonglowModel
      @model_name = name
      @client = that.Client
      @model = Model

      constructor: (params) ->
        @model_name = model_name
        @client = that.Client
        for name, value of params
          if !this[name]
            this[name] = value

        super(params)

    return Model

#--------- Model ------------
class MonglowModel
  constructor: ->
    this.restrictedFields = ['remove', '_raw', 'model', 'update', 'save', 'create', 'constructor', 'fields', 'restrictedFields', 'client', 'model_name']

  save: (callback) ->
    self = this

    this.client.collection(@model_name).save @fields(true), (err, result) ->
      if err
      else
        #result._id = result._id.toString()
        self._id = result._id
      callback(err, result) if callback

  remove: ->
    if @_id
      this.client.collection(@model_name).remove({_id: @_id})
    
  fields: (raw) ->
    _fields = {}
    for name, value of @
      _fields[name] = value if this.restrictedFields.indexOf(name) == -1
    _fields._id = @raw._id if raw && @raw
    
    console.log(_fields)
    _fields

  this.references_many = (ref_name) ->
    @many_references = [] if !@many_references
    @many_references.push(ref_name)

  this.find = (callback) ->
    self = this
    req = this.client.collection(@model_name).find()
    return req.toArray((err, items) -> 
        objects = []
        for item in items
          model = new self.model(item)
          model._raw = item
          model.model_name = self.model_name
          objects.push model
        callback(err, objects) if callback
      )


module.exports = new Monglow
