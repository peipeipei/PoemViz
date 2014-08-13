
Router.map(function () {
  this.route('poem', {
    path: '/poem/:id',
    template: 'poem',
    waitOn: function(){
      var subscriptions = [Meteor.subscribe('poemGroups', this.params.id), Meteor.subscribe('poems', this.params.id), Meteor.subscribe('selections', this.params.id), Meteor.subscribe('layers', this.params.id), Meteor.subscribe('styles', this.params.id), Meteor.subscribe('syllableMarkers', this.params.id), Meteor.subscribe('shoutkeys'), Meteor.subscribe('colorIndices', this.params.id), Meteor.subscribe('colors', this.params.id)];
      return subscriptions;
    },
    data: function(){
      var poem_id = this.params.id
      console.log("poemid: ",poem_id)
//      console.log( Poems.findOne(poem_id) );
      var poemTitle = Poems.findOne({_id:poem_id}).title;
      var poemAuthor = Poems.findOne({_id:poem_id}).author;
      var lines = Poems.findOne({_id:poem_id}).origObj;
      var lines1 = Poems.findOne({_id:poem_id}).puncObj;
      var lines2 = Poems.findOne({_id:poem_id}).sentObj;
        
     // console.log(poem_id,poem);
      Session.set('currentPoem', this.params.id);
      return {
          poemTitle: poemTitle,
          poemAuthor: poemAuthor,
          lines: lines,
          lines1: lines1,
          lines2: lines2
      }
    },
    action: function(){
        if (this.ready()) {
            this.render();
        } 
    }    
    })
  //make sure to subscribe to shoutkeys so that they may be checked to prevent repeats
    this.route('teacher', {
        path:'/create',
        waitOn: function(){
            return [Meteor.subscribe('shoutkeys')]
        },  
    })
    this.route('redirect',{
        path: '/:_word/:_index',
//        path: '/:_word/',
        notFoundTemplate: 'error',
        waitOn: function(){
            //console.log("id:",this.params.id)
//          return [Meteor.subscribe('poems', this.params.id), Meteor.subscribe('shoutkeys')]
            return [Meteor.subscribe('poems'), Meteor.subscribe('shoutkeys')]
        },
        data: function(){
            return {"poem_id": Shoutkeys.findOne({key:this.params._word, index:parseInt(this.params._index)}).poem_id};
        },
        action: function(){
        if (this.ready()) {
            this.render();
        } 
        }
    });
});   


Template.redirect.redirect = function(){
    // New Poem Group Implementation
    console.log("this:");
    
    console.log(this);
    console.log(this.poem_id);
//    Router.go('/poem/'+this.poem_id, '_blank');
//    Router.go('poem', {"id":this});
//    console.log(this)
//    console.log("this . poem id");
//    console.log(this.poem_id);
    Router.go('poem', {"id":this.poem_id});
}

Template.redirect.isReady = function(){
  //return checkIsReady();
    return true;
}
