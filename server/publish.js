Meteor.publish('poems', function () {
  return Poems.find()
});

Meteor.publish('annotations', function () {
  return Annotations.find()
});