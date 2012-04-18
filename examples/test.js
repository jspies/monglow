var Person = Class.extend({});
Person.statics({
  hi: function() { console.log("hi")}
});

var SuperHuman = Person.extend({});

//Class.hi();
Person.hi();
SuperHuman.hi();