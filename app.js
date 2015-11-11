////////////////////////////////
//        questions           //
////////////////////////////////

// cannot figure out how to get my contacts information to show up
// when name is clicked
// get input boxes to clear after add contact button is clicked
// get the add contact button to work

/////////////////////////////////
/////////////////////////////////
//        directions           //
/////////////////////////////////
/////////////////////////////////

// Create an app that lets you manage a list of Contacts. Each Contact can (but not required to) have:
//
// email
// name (first, last)
// phone number
// twitter username
// linkedin
// Create an app that has a form for entering Contact information (described above).
//
// Some of the informaton can be optional
// The app should re-render automatically (by use of the Backbone events)
// You should wireframe and design a basic layout before starting this app.
// Your app should use HTML/SCSS extensively for styling.
// You should use a Backbone.Router to handle routes for a home screen.
// You should have one Backbone.View sub-classes: a HomeView constructor.
// You should have a Contact Model constructor and Collection that uses the Contact model

//////////////////////////////
//        model             //
//////////////////////////////
// this will save our list of contacts data to the server
// will use the posts method to create a new post record to the server

var Contact = Backbone.Model.extend({
  urlRoot: 'https://tiny-starburst.herokuapp.com/collections/kate'
});

//////////////////////////////
//        collections       //
//////////////////////////////

// this is the posts collection which will fetch all the posts from the server.
// by giving the collection a model it will allow for all the items in our server
// be of type post.
var Contacts = Backbone.Collection.extend({
  url: 'https://tiny-starburst.herokuapp.com/collections/kate',
  model: Contact
});

//////////////////////////////
//          views           //
//////////////////////////////

// this view will create a new view where we can handle the users interaction

var ListView = Backbone.View.extend({
  template: _.template($('#ListViewTemplate').html()),
  render: function(){
    this.$el.html(this.template({
      contacts: this.collection.toJSON()
    }));
    return this;
  }
});

// this view will create a new view where we can handle the users interaction.
// will listen for events that happen within our view. i.e. when user presses
// a key on the message input and when user clicks on the send button

var EditView = Backbone.View.extend({
    template: _.template($('#EditViewTemplate').html()),
    render: function() {
      this.$el.html(this.template())
      console.log('hi');
    },
    events: {
    'keypress .msg' : 'handleEnter',
    'click .send'   : 'handleSendClick'
  },

// this function will be called after the handleEnter and handleSendClick is run.
// below is where the input value will be stored to the correct input.

  send: function(){
    var email        = this.$('.email').val();
    var firstName    = this.$('.firstname').val();
    var lastName     = this.$('.lasname').val();
    var phoneNumber  = this.$('.phonenumber').val();
    var twitter      = this.$('.twitter').val();
    var linkedin     = this.$('.linkedin').val();

    // if (.email.trim() === '') {
    //   alert("don't forget your email!");
    //   return;
    // }
    // if (.firstname.trim() === '') {
    //   alert("you don't know your first name?!");
    //   return;
    // }
    // if (.lastname.trim() === '') {
    //   alert("whatcho last name?");
    //   return;
    // }
    ////////////////////////////
    //          posts         //
    ////////////////////////////


    // creates a post model so that it will send the data to the server, and
    // add the new post model to the posts collection, will keep the list up to date
    // and send the data to the server

    this.collection.create({
      email       : email,
      firstName   : firstname,
      lastName    : lastName,
      phoneNumber : phonenumber,
      twitter     : twitter,
      linkedin    : linkedin
    });
  },

  // listen to the keypresses, which is defined above
  handleEnter: function(event){
    if (event.keyCode === 13) {
      this.send();
    }
  },

  // listen to key click, which is defined above.

  handleSendClick: function(event){
    event.preventDefault();
    this.send();
  },
  // render: function(){
  //   var html = $('#EditViewTemplate').html();
  //   this.$el.html(html);
  //   return this;
  // }
});

//////////////////////////////
//        routes            //
//////////////////////////////

var Router = Backbone.Router.extend({
  routes: {
    ''           : 'home',
    'contact/:id': 'viewPost'
  },

  home: function(){
    //creates a new homepage view
    var mainView = new EditView();
    //renders the template to the view
    mainView.render();
    //renders the view to the main tag
    $('main').html(mainView.el);
  },

  viewPost: function(){
    var model = new Contact({
      id: postId
    });
    model.fetch().then(function(){
      var view = new ListView({
        model: model
      });
      view.render();
      $('main').html(view.el);
    });
  }
});


function buildSidebar(){
  var collection = new Contacts();
  //create a new home page view
  var sidebarView = new ListView({
    collection: collection
  });

  collection.fetch().then(function(){
    //render the template to the view
    sidebarView.render();
    //render the view to the main tag
    $('.sidebar').html(sidebarView.el);
  });
}

buildSidebar();
var router = new Router();
Backbone.history.start();
