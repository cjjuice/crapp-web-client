//------------------------------
// Application
//------------------------------
var App = Em.Application.create();

//------------------------------
// Models
//------------------------------
App.Password = Em.Object.extend({
    text: null
});

//------------------------------
// Views
//------------------------------
App.MyView = Em.View.extend({
  mouseDown: function() {
    window.alert("hello world!");
  }
});

//------------------------------
// Controllers
//------------------------------
App.passwordController = Em.ArrayController.create({
    content: [],
    loadPassword: function() {
        var me = this;
        var url = "http://localhost:5000/get/password?&callback=?";

        $.getJSON(url, function(data){
            var p = App.Password.create({
                text: data.password
            });
            me.pushObject(p);
        });
    },
    clear: function() {
        this.set('content', []);
    }
});

