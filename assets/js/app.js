//------------------------------
// Application
//------------------------------
var App = Em.Application.create({
    ready: function() {
      $("#bathroomData").hide();
    }
});

//------------------------------
// Models
//------------------------------
App.Bathroom = Em.Object.extend({
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
// Views
//------------------------------
App.MyView = Em.View.extend({
  mouseDown: function() {
    window.alert("hello world!");
  }
});

App.LocationFormView = Ember.View.extend({
  lat: null,
  lng: null,

  submitLocation: function() {
    var lat = this.get('lat');
    var lng = this.get('lng');

    console.log("Here!");
    console.log(lat);
    console.log(lng);
  },
});

//------------------------------
// Classes
//------------------------------
App.ArrayControllerSortable = Em.ArrayController.extend(Ember.SortableMixin);

//------------------------------
// Controllers
//------------------------------
App.bathroomController = App.ArrayControllerSortable.create({
    content: [],
    sortProperties: ['distance'],
    loadBathrooms: function () {
        this.clear();

        var me = this;

        var lat = $("#lat").val();
        var lng = $("#lng").val();
        
        console.log(lat);
        console.log(lng);
        console.log(parseFloat(lat).toFixed(2));

        //var url = "http://localhost:3000/bathrooms/fetch?lat=41.819870&lng=-71.412601&callback=?";
        //var url = "http://crapp-api.herokuapp.com/bathrooms/fetch?lat=41.819870&lng=-71.412601&callback=?";

        var url = "http://crapp-api.herokuapp.com/bathrooms/fetch?";
        var url = url + "lat=" + lat;
        var url = url + "&";
        var url = url + "lng=" + lng;
        var url = url + "&";
        var url = url + "callback=?";

        $.getJSON(url, function(data){
            // For each bathroom, create objects.
            $.each(data.bathrooms, function(index) {
              console.log(this.info.name);
              var p = App.Bathroom.create({
                  name: this.info.name,
                  lat: this.info.lat,
                  lng: this.info.lng,
                  distance: parseFloat(this.distance).toFixed(2),
              });
              me.addObject(p);
            });
            
            // Show the Bathroom data table.
            $("#bathroomData").show();
        });
    },
    loadCoords: function() {
        $("#lat").val("41.819870");
        $("#lng").val("-71.412601");
    
        this.clear();
        this.loadBathrooms();
    },
    clear: function() {
        this.set('content', []);
    }
});
