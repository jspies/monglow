var Monglow = require("../lib/monglow")
Monglow.connect("mongo://127.0.0.1:27017/monglow_test");

var Author = Monglow.model("authors");
var Post = Monglow.model('posts');

Post.references_many("authors");

// ---- statics test 
Post.staticMethod = function(bor) {
  console.log(bor);
}
Post.staticMethod("test passed");
// ----


var posts = Post.find(function(err, items) {
  if (items.length > 1) {
    items[0].name = "title2";
    items[0].save(function(err) {
      items[1].remove();
    });
  }
});

var post = new Post({name: "first title", body: "I wrote this"});
post.save();

//var second_post = Post.new({title: "This is my title!", body:"I am writer!"}); // this should work

/*

var post = Post.new();

post.save(function(error) {

});
var success = post.save(); // syncronous

var second_post = new Post({title: "This is my title!", body:"I am writer!"}); // this should work

second_post.has.tags; // tags is an array of tag objects
*/