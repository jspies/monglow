var Monglow = require("../lib/monglow")
Monglow.connect("mongo://127.0.0.1:27017/monglow_test");

var Author = Monglow.model("authors");

var Post = Monglow.model('posts', {
  references_many: ["authors"]
});

// ---- statics test 
Post.staticMethod = function(bor) {
  console.log(bor);
}
Post.staticMethod("test passed");
// ----

var author = new Author({name: "Jonathan"})
author.save();

var posts = Post.find({name: "title"}, function(err, items) {
  console.log(items)
  if (items.length > 10) {
    
    items[0].save(function(err) {
      items[1].remove();
    });
  }
});

var post = new Post({name: "first title", body: "I wrote this"});
post.save();
post.authors.push(author); // TODO: make enumerating produce authors.ids so it will save

var post = new Post({name: "title", body: "I wrote this"});
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