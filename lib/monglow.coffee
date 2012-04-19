Mongolian = require("mongolian")

#--------- Model ------------
class MonglowModel
  constructor: ->
    # hide our pretty properties
    Object.defineProperty(this, "model_name", {enumerable:false})
    Object.defineProperty(this, "client", {enumerable:false})
    Object.defineProperty(this, "references_many", {enumerable:false})

  #this.references_many = (ref_name) ->
  #  @many_references = [] if !@many_references
  #  @many_references.push(ref_name)

  this.find = (callback) ->
    self = this
    req = this.client.collection(@model_name).find()
    return req.toArray((err, items) -> 
        objects = []
        for item in items
          model = new self.model(item)
          model.model_name = self.model_name
          objects.push model
        callback(err, objects) if callback
      )

Object.defineProperty(MonglowModel.prototype, "save", {
    value: (attributes, callback) ->
      self = this
      if typeof attributes == "function"
        callback = attributes

      this.client.collection(@model_name).save @, (err, result) ->
        if err
        else
          #result._id = result._id.toString()
          self._id = result._id
        callback(err, result) if callback
})

# this method is a hack until we figure out how to make constructor not enumerable
Object.defineProperty(MonglowModel.prototype, "fields", {
    value: ->
      _fields = {}
      for name, value of @
        _fields[name] = value if name != "constructor"
      _fields
  })

Object.defineProperty(MonglowModel.prototype, "remove", {
    value: ->
        if @_id
          this.client.collection(@model_name).remove({_id: @_id})
    ,
    enumerable: false
})

class Monglow
  constructor: (server_string) ->
    this.server_string = server_string
  connect: (server_string) ->
    return this.Client if this.connected(server_string)
    if server_string
      this.server_string = server_string
    if !this.server_string
      this.server_string = "mongo://127.0.0.1:27017/monglow_test"
    this.Client = new Mongolian(this.server_string)
  connected: (server_string) ->
    this.Client and (typeof(server_string) == "undefined" or server_string == this.server_string)
  close: ->
    this.Client.close()

  model: (name, options) ->
    that = this
    model_name = name
  
    class Model extends MonglowModel
      @model_name = name
      @client = that.Client
      @model = Model
      @references_many = options.references_many if options

      constructor: (params) ->
        @model_name = model_name
        @client = that.Client
        @references_many = options.references_many if options

        if @references_many
          for ref in @references_many
            this[ref] = new MonglowRelation
            Object.defineProperty(this, ref, {enumerable:false})
        
        for name, value of params
          if !this[name]
            this[name] = value

        super(params)

    Object.defineProperty(Model.prototype, 'constructor', {enumerable:false})

    return Model

class MonglowRelation
  constructor: ->
    @ids = []
    @all = []

Object.defineProperty(MonglowRelation.prototype, 'push', {
    enumerable: false,
    value: (object)->
      @ids.push object._id
      @all.push object
  })

module.exports = new Monglow
