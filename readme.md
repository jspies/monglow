Monglow
-----------

A MongoDB ODM for Node.js. Monglow focuses on dead simple model declaration, allowing a schema less definition, and providing easy relationships.

I couldn't find one that did these things, so here I am.

Init
-------------
```javascript
var Monglow = require("monglow")
Monglow.connect("mongo://localhost/monglow") // leaving blank results in localhost/monglow_test
```

I recommend doing the connect in an initializer so you only have to call it once.

A Model
-------------
```javascript
var Post = Monglow.model('posts');
```

Done. Seriously. But you can do more if you want.

Like add a static finder.

```javascript
Post.find_by_custom_stuff = function(callback) {
  this.find({stuff: "custom"}, callback);
}
```

Then you can use the model.

```javascript
var post = new Post({name: "Jonathan"});
post.save();
post.remove();
Post.create({name: "not Jonathan"});

Post.find(function(err, posts) {
  // do stuff with posts
  posts[0].name = "Spies";
  posts[0].save();

  posts[0].save({name: "not Spies"});
});
```

Relationships
-------------
```javascript
var Author = Monglow.model("authors");

Post.references_many('authors');
```
