//------------------------------
// Application
//------------------------------
window.App = Ember.Application.create({
  ApplicationView: Ember.View.extend({
    templateName:  'application'
  }),
  ApplicationController: Ember.Controller.extend(),
  ready: function(){
    console.log("Created App namespace");
  },
});

//------------------------------
// Models
//------------------------------
App.Bathroom = Em.Object.extend({
    id: null,
    name: null,
    address: null,
    city: null,
    state: null,
    zip: null,
    lat: null,
    lng: null,
    isHandicapAccessible: null,
    isPublic: null,
    isFamily: null,
    isGreen: null,
    isUnisex: null,
    isHandsFree: null,
    hasProductDispenser: null,
    hasAttendent: null,
    hasSignage: null,
    hasWifi: null,
    bathroomtype_id: null,
    created_at: null,
    distance: null
});

//------------------------------
// Controllers
//------------------------------
App.ArrayControllerSortable = Em.ArrayController.extend(Ember.SortableMixin);

App.BathroomsController = Em.ArrayController.extend(Ember.SortableMixin, {
  content: [],
  latitude: '',
  longitude: '',
  sortProperties: ['distance'],
  loadCoordinates: function() {
    console.log("loadCoordinates called!");
    console.log('Latitude: ', this.get('latitude'));
  }
});

App.BathroomController = Em.ObjectController.extend();

//------------------------------
// Controllers Instantiations
//------------------------------
App.bathroomsController = App.BathroomsController.create();

//------------------------------
// Views
//------------------------------
App.BathroomsView = Em.View.extend({
  templateName: 'bathrooms'
});

App.BathroomView = Em.View.extend({
  templateName: 'bathroom'
});

App.LocationTextField = Em.TextField.extend({
  //isVisibleBinding: 'App.testThis.visible',
  classNames: ['input-small'],
  insertNewline: function(){
    //App.tweetsController.loadTweets();
    console.log('Someone hit enter!');
  },
});

//------------------------------
// Test Data
//------------------------------
testBathroom_1 = App.Bathroom.create({
  name: "Facility 1",
  address: "100 Grand St",
  distance: 0.5198,
  id: 1
});

testBathroom_2 = App.Bathroom.create({
  name: "Facility 2",
  address: "100 Park St",
  distance: 0.3201,
  id: 2
});

//------------------------------
// Router
//------------------------------
App.Router = Em.Router.extend({
  root: Em.Route.extend({
    index: Em.Route.extend({
      route: '/',
      redirectsTo: 'bathrooms'
    }),
    bathrooms: Em.Route.extend({
      route: '/bathrooms',
      showBathroom: Em.Router.transitionTo('bathroom'),
      connectOutlets: function(router) {
        return router.get("applicationController").connectOutlet('bathrooms', [testBathroom_1, testBathroom_2]);
      }
    }),
    bathroom: Em.Route.extend({
      route: '/bathrooms/:bathroom_id',
      connectOutlets: function(router, bathroom) {
        return router.get('applicationController').connectOutlet('bathroom', bathroom);
      }
    })
  })
});

App.router = App.Router.create();

App.initialize(App.router);
