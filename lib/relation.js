var MonglowRelation = (function() {
  MonglowRelation.name = 'MonglowRelation';

  function MonglowRelation() {
    this.ids = [];
    this.all = [];
  }

  return MonglowRelation;

})();

Object.defineProperty(MonglowRelation.prototype, 'push', {
  enumerable: false,
  value: function(object) {
    this.ids.push(object._id);
    return this.all.push(object);
  }
});

module.exports = MonglowRelation;