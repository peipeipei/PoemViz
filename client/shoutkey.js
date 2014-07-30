getRandomWord = function(){
  return pgpWordList[Math.floor(Math.random()*pgpWordList.length)][0]
}

launchExercise = function(){
    var key = getRandomWord()
    console.log(key); 
//    return "hi";
}


//function launchExercise(_id){
//    var key = getRandomWord()
//    Exercises.update({_id:_id},{$set:{keyword: key}})                  //sets the key as active 
//    function removekey(){
//      console.log('removing key')
//      Exercises.update({_id:_id}, {$unset:{keyword: ''}})  
//    }
//    Meteor.setTimeout(removekey, 3600000)                                //removes the key after an hour.
//    $div = $('<div>')
//    $div.attr('title', 'Launch')
//    url = window.location.host + '/' + key
//    $div.html('your exercise is active for one hour at <br>' + url + '<br>To have your students go to a predetermined group, have them go to the link<br>' + url + '/x, where x is the group number.')
//    $div.dialog({
//      resizable: false,
//      height:250,
//      width:500,
//      modal: true,
//      buttons: {
//        "Go": function() {
//          $( this).dialog('close');
//          window.open('/'+key, '_blank');
//        },
//        Cancel: function() {
//          $( this ).dialog( "close" );
//        }
//      }
//  })
//}