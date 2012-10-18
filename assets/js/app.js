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
App.Score = Em.Object.extend();

App.Review = Em.Object.extend();

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
  distance: null,

  scores: [],
  reviews: [],

  getAddress: function() {
    var address = this.get('address');
    var city = this.get('city');
    var state = this.get('state');
    var zip = this.get('zip');
    return address + ' ' + city + ', ' + state + ' ' + zip;
  }.property('address', 'city', 'state', 'zip')
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
  loadBathrooms: function () {
    this.clear();

    var me = this;

    var lat = me.get("latitude");
    var lng = me.get("longitude");

    var token = "7635b571a558921a3efb686e322df599";

    console.log(lat);
    console.log(lng);

    if (lat && lng) {
      // Build a url to query.
      var url = "http://localhost:3000";
      //var url = "http://crapp-api.herokuapp.com";
      var url = url + "/bathrooms/fetch?";
      var url = url + "lat=" + lat;
      var url = url + "&";
      var url = url + "lng=" + lng;
      var url = url + "&";
      var url = url + "access_token=" + token;
      var url = url + "&";
      var url = url + "callback=?";

      $.getJSON(url, function(data){
        // For each bathroom, create objects.
        $.each(data.bathrooms, function(index) {
          var p = App.Bathroom.create({
            id: this.info.id,
            name: this.info.name,
            lat: this.info.lat,
            lng: this.info.lng,
            distance: parseFloat(this.distance).toFixed(2),
          });
          me.addObject(p);
        });

      });
    }
  },
  loadCoordinates: function() {
    var me = this;

    // Hack because I'm on an airplane lol. Remove this!
    me.set('latitude', '41.819870');
    me.set('longitude', '-71.412601');
    me.loadBathrooms();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        me.set('latitude', position.coords.latitude);
        me.set('longitude', position.coords.longitude);

        me.loadBathrooms();
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  },
  clear: function() {
      this.set('content', []);
  }
});

App.BathroomController = Em.ObjectController.extend();

//------------------------------
// Controllers Instantiations
//------------------------------
App.bathroomsController = App.BathroomsController.create({
  // Again, I'm on a plane, so I need to force data into my controller! This
  // is a hack!
  loadBathrooms: function() {
    var me = this;

    [1, 2, 3, 4].forEach(function(num) {
      var p = App.Bathroom.create({
        id: num,
        name: 'Facility ' + num,
        lat: '41.' + num,
        lng: '-71.' + num,
        distance: '0.' + num,
        address: num + '00 Park Ave',
        city: 'Providence',
        state: 'RI',
        zip: '02906',
      });
      me.addObject(p);
    });
  },
});

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
        return router.get("applicationController").connectOutlet('bathrooms', App.Bathroom.all);
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
