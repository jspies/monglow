var Monglow = require("../lib/monglow");
Monglow.connect("mongo://localhost/monglow_test");
require('should');

describe("Monglow", function() {
  describe("#connected()", function() {
    it('should be true if this.Client exists and server_string exists and matches this.server_string', function() {
      Monglow.connected("mongo://localhost/monglow_test").should.equal(true)
    })
  })

  describe("#connect()", function() {
    it('should store server_string', function() {
      Monglow.server_string.should.equal("mongo://localhost/monglow_test")
    })

    // it('should not reconnect if it has a matching server_string', function() {
      //Monglow.connect("mongo://localhost/monglow_test");
    // })

    it('should return a Mongolian object', function() {
      Monglow.connect().should.be.a('object').with.property('server');
    })

  })
})