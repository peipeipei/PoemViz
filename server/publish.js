Meteor.publish('poemGroups', function() {
    return PoemGroups.find()
});
Meteor.publish('poems', function (poemID) {
  return Poems.find(poemID)
});

Meteor.publish('layers', function(poemID){
    return Layers.find({poem_id: poemID})
})

Meteor.publish('selections', function (poemID) {
  return Selections.find({poem_id: poemID})
});


Meteor.publish('styles', function (poemID) {
  return Styles.find({poem_id: poemID})
});

Meteor.publish('syllableMarkers', function(poemID) {
    return SyllableMarkers.find({poem_id: poemID})
});

Meteor.publish('shoutkeys', function() {
    return Shoutkeys.find()
});
Meteor.publish('colorIndices', function(poemID) {
    return ColorIndices.find({poem_id: poemID})
});
Meteor.publish('colors', function(poemID) {
    return Colors.find({poem_id: poemID})
});


