Meteor.publish('poems', function () {
  return Poems.find()
});

Meteor.publish('layers', function(){
    return Layers.find()
})

Meteor.publish('selections', function () {
  return Selections.find()
});


Meteor.publish('styles', function () {
  return Styles.find()
});

Meteor.publish('syllableMarkers', function() {
    return SyllableMarkers.find()
});

Meteor.publish('lineCounts', function() {
    return LineCounts.find()
});

