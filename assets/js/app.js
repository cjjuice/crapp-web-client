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

App.testThis = Em.Object.create({
    visible: false,
});

//------------------------------
// Views
//------------------------------
App.LocationTextField = Em.TextField.extend({
    isVisibleBinding: 'App.testThis.visible',
    classNames: ['input-small'],
    insertNewline: function(){
        //App.tweetsController.loadTweets();
        console.log('Someone hit enter!');
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
            var url = "http://crapp-api.herokuapp.com/bathrooms/fetch?";
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
        }
    },
    loadCoordinates: function () {
        var me = this;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                me.set('latitude', position.coords.latitude);
                me.set('longitude', position.coords.longitude);

                App.testThis.set('visible', true);

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
