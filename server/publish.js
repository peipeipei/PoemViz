Meteor.publish('poems', function () {
  return Poems.find()
});

Meteor.publish('layers', function(){
    return Layers.find()
})

Meteor.publish('annotations', function () {
  return Annotations.find()
});