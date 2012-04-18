var Monglow = require("../lib/monglow")
Monglow.connect("mongo://localhost/monglow_test");
require('should');

describe("MonglowModel", function() {
  describe("this.find()", function() {

    it("should return an array", function(done) {
      var Post = Monglow.model("posts");
      Post.find(function(err, posts) {
        if (err) done(err);
        posts.should.be.an.instanceof(Array);
        done();
      });
    })

  })
});