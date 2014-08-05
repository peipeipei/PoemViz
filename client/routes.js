
Router.map(function () {
  this.route('poem', {
    path: '/poem/:id',
    template: 'poem',
    waitOn: function(){
      var subscriptions = [Meteor.subscribe('poems', this.params.id), Meteor.subscribe('selections', this.params.id), Meteor.subscribe('layers', this.params.id), Meteor.subscribe('styles', this.params.id), Meteor.subscribe('syllableMarkers', this.params.id)]
      return subscriptions;
    },
    data: function(){
      var poem_id = this.params.id
      console.log("poemid: ",poem_id)
      console.log( Poems.findOne(poem_id) );
      var poemTitle = Poems.findOne({_id:poem_id}).title
      var poemAuthor = Poems.findOne({_id:poem_id}).author
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
    this.route('teacher', {path:'/create'})
    this.route('redirect',{
        path: '/:_word',
        notFoundTemplate: 'error',
        waitOn: function(){
          return [Meteor.subscribe('poems', this.params.id), Meteor.subscribe('shoutkeys')]
        },
        data: function(){
            console.log(this);
            console.log(Shoutkeys.findOne({key:this.params._word}));
            return {"shoutkey":Shoutkeys.findOne({key:this.params._word})};
        },
        action: function(){
        if (this.ready()) {
            this.render();
        } 
        }
    });
});   


Template.redirect.redirect = function(){

    Router.go('poem', {"id":this.shoutkey.poem_id});
}

Template.redirect.isReady = function(){
  //return checkIsReady();
    return true;
}
