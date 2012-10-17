window.App = Ember.Application.create({
  ApplicationView: Ember.View.extend({
    templateName:  'application'
  }),
  ApplicationController: Ember.Controller.extend(),
  ready: function(){
    console.log("Created App namespace");
  },
});

App.Post = Em.Object.extend({
  title: null,
  body: null,
  id: null
});

App.PostsController = Em.ArrayController.extend({
  content: []
});

App.PostController = Em.ObjectController.extend();

App.PostsView = Em.View.extend({
  templateName: 'posts'
});

App.PostView = Em.View.extend({
  templateName: 'post'
});

testPost = App.Post.create({
  title: "Post Title",
  body: "Post Body",
  id: 1
});

App.Router = Em.Router.extend({
  root: Em.Route.extend({
    index: Em.Route.extend({
      route: '/',
      redirectsTo: 'posts'
    }),
    posts: Em.Route.extend({
      route: '/posts',
      showPost: Em.Router.transitionTo('post'),
      connectOutlets: function(router) {
        return router.get("applicationController").connectOutlet('posts', [testPost]);
      }
    }),
    post: Em.Route.extend({
      route: '/posts/:post_id',
      connectOutlets: function(router, post) {
        return router.get('applicationController').connectOutlet('post', post);
      }
    })
  })
});

App.router = App.Router.create();

App.initialize(App.router);
