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
      var poemTitle = Poems.findOne({_id:poem_id}).title
      var poemAuthor = Poems.findOne({_id:poem_id}).author
      var poem = Poems.findOne({_id:poem_id}).htmlContent
<<<<<<< HEAD
      //console.log(poem_id,poem);
      Session.set('currentPoem', this.params.id);
      
     /* var poem2 = [
          {type: "line", order: "1", content: [
        {
         type:"letter",
         order: "0",
         content: "h"
        },        {
         type:"letter",
         order: "1",
         content: "i"
        }
      ]}
      
      , 
      {type: "line", order: "2", content: [
        {
         type:"letter",
         order: "2",
         content: "y"
        },        {
         type:"letter",
         order: "3",
         content: "o"
        }
      ]}
      ]
      console.log(poem2)*/
      return {poem: poem}
      
=======
      
      console.log(poem_id,poem);
      Session.set('currentPoem', this.params.id);
      return {
          poemTitle: poemTitle,
          poemAuthor: poemAuthor,
          poem: poem
      }
>>>>>>> eab5dca71f921207b980649fc5c5f8f1fdb5e544
    },
    action: function(){
        if (this.ready()) {
            this.render();
        } 
    }    
    })
    this.route('teacher', {path:'/create'})
});   