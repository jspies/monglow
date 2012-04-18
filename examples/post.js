var Monglow = require("../lib/monglow");

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
  console.log(items)
  if (items.length > 0) {
    items[0].name="title2";
    items[0].save(function(err) {
      items[0].remove();
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