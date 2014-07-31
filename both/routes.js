/*Router.map(function () {
  this.route('poem', {
    path: '/poem/:id',
    template: 'poem',
    waitOn: function(){
      var assignment_id = this.params.id
      return Meteor.subscribe('poems')
      //Meteor.subscribe('poems')
      //Meteor.subscribe('annotations')
    },
    data: function(){
      var poem_id = this.params.id
      var poem = Poems.findOne({_id:poem_id}).htmlContent
      var annotations = Annotations.find({poem_id: poem_id}).fetch()
      
      
      _.each(annotations, function(annotation){
        var start = annotation.start
        var end = annotation.end
        poem = poem.substring(0, start) + "<b>" + poem.substring(start, poem.length)
        poem = poem.substring(0, end) + "</b>" + poem.substring(end, poem.length)
      })
      Session.set('currentPoem', this.params.id);
      //console.log(annotations);
      return {poem: poem, annotations: annotations}
    },
    action: function(){
      this.render()
      console.log('render');
    },
    
    onAfterAction: function(){
        console.log("onafteraction");
    }
    
    })
});*/


Router.map(function () {
  this.route('poem', {
    path: '/poem/:id',
    template: 'poem',
    waitOn: function(){
      return [Meteor.subscribe('poems'), Meteor.subscribe('selections'), Meteor.subscribe('layers'), Meteor.subscribe('styles'), Meteor.subscribe('syllableMarkers')]
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
     /* if (Session.get('breaksOption') == 'puncOption'){
      var lines = Poems.findOne({_id:poem_id}).puncObj;}
      else{
          if (Session.get('breaksOption') == 'sentOption'){
              var lines = Poems.findOne({_id:poem_id}).sentObj;
          }
          else{
              var lines = Poems.findOne({_id:poem_id}).origObj;
          }
      }*/
      
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
});   