Router.map(function () {
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
      console.log(poem)
      console.log(annotations)
      return {poem: poem, annotations: annotations}
    },
    action: function(){
      this.render()
    }
    
    })
});