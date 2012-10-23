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

var token = "7635b571a558921a3efb686e322df599"; 
//------------------------------
// Models
//------------------------------
App.Score = Em.Object.extend({
  type: null,
  value: null,
  created_at: null,
});

App.Review = Em.Object.extend({
  text: null,
  created_at: null,
});

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

});

//------------------------------
// Controllers
//------------------------------
App.ArrayControllerSortable = Em.ArrayController.create(Ember.SortableMixin);

App.BathroomsController = Em.ArrayController.extend({
  content: [],
  latitude: '',
  longitude: '',
  sortProperties: ['distance'],
  loadBathrooms: function () {
    this.clear();

    var me = this;

    var lat = me.get("latitude");
    var lng = me.get("longitude");

    console.log(lat);
    console.log(lng);

    if (lat && lng) {
      // Build a url to query.
      
      var url = "http://crapp-api.herokuapp.com";
      var url = url + "/bathrooms/fetch?";
      var url = url + "lat=" + lat;
      var url = url + "&";
      var url = url + "lng=" + lng;
      var url = url + "&";
      var url = url + "access_token=" + token;
      var url = url + "&";
      var url = url + "callback=?";

      console.log(url);

      $.getJSON(url, function(data){
        // For each bathroom, create objects.
        $.each(data.bathrooms, function(index) {
          var p = App.Bathroom.create({
            id: this.info.id,
            name: this.info.name,
            address: this.info.address,
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

App.BathroomAddController = Em.ObjectController.extend({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    latitude: '',
    longitude: '',

    addBathroom: function() {
    var me = this;  
    
    var name =  me.get('name');
    var address =  me.get('address');
    var city =  me.get('city');
    var state =  me.get('state');
    var zip =  me.get('zip');
    var lat =  me.get('latitude');
    var lng =  me.get('longitude');
    
    //build url
    var url = "http://crapp-api.herokuapp.com/bathrooms/add?";
    var url = url + "name=" + name                           ;
    var url = url + "&address=" + address                    ;
    var url = url + "&city=" + city                          ;
    var url = url + "&state=" + state                        ;
    var url = url + "&zip=" + zip                            ;
    var url = url + "&lat=" + lat                            ;
    var url = url + "&lng=" + lng                            ;
    var url = url + "&access_token=" + token                 ;
    var url = url + "&"                                      ;
    var url = url + "callback=?"                             ;
    console.log(url);
           
    $.getJSON(url, function(data){ 
         if (data.id) {
             console.log("add bathroom success");
         } else {
             console.log("add bathroom fail");
         }
       });
     App.bathroomsController.loadBathrooms();  
   }, 
  
     loadCoordinates: function() {
     var me = this;

     if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          me.set('latitude', position.coords.latitude);
          me.set('longitude', position.coords.longitude);
        
          me.addBathroom();
        });
     } else {
         console.log("Geolocation is not supported by this browser.");
     }
  },                                           
});

App.ReviewsController = Em.ArrayController.extend();

//------------------------------
// Controllers Instantiations
//------------------------------
App.bathroomsController = App.BathroomsController.create();
App.bathroomAddController = App.BathroomAddController.create();

//------------------------------
// Views
//------------------------------
App.BathroomsView = Em.View.extend({
  templateName: 'bathrooms'
});

App.BathroomView = Em.View.extend({
  templateName: 'bathroom'
});

App.ReviewsView = Em.View.extend({
  templateName: 'reviews'
});

App.BathroomAddView = Em.View.extend({
  templateName: 'bathroomAdd'
});

App.LocationTextField = Em.TextField.extend({
  classNames: ['input-small'],
  insertNewline: function(){
    console.log('Someone hit enter!');
  },
});



//------------------------------
// Router
//------------------------------
App.Router = Em.Router.extend({
  gotoBathroomAdd: Em.Router.transitionTo('bathrooms.add'),
  root: Em.Route.extend({
    index: Em.Route.extend({
      route: '/',
      redirectsTo: 'bathrooms.index',
    }),
    bathrooms: Em.Route.extend({
      route: '/bathrooms',
      showBathroom: Em.Router.transitionTo('bathroom'),
      showAddBathroom: Em.Router.transitionTo('add'), 
      index: Em.Route.extend({
        route: '/',
        connectOutlets: function(router) {
          router.get("applicationController").connectOutlet('bathrooms', App.Bathroom.all);
        }
      }),
      bathroom: Em.Route.extend({
        route: '/:bathroom_id',
        connectOutlets: function(router, bathroom) {
          router.get('applicationController').connectOutlet('bathroom', bathroom);
          router.get('bathroomController').connectOutlet('reviews', bathroom.reviews);
        }
      }),
      add: Em.Route.extend({
        route: '/add',
        connectOutlets: function(router) {
          console.log('bathroomAdd connect!');
          router.get('applicationController').connectOutlet('bathroomAdd');
        }
      }),
    }),
  })
});

App.router = App.Router.create();

App.initialize(App.router);
