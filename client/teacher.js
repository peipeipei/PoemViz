
Template.teacher.isReady = function(){
  return checkIsReady();  
}

Template.teacher.events({
    'click #submitPoem':function(){
        var title = $('#title').val();
        var author = $('#author').val();
        var raw=$('#createPoem').val();
        var poemObjsArray = parseHTML(raw);
        var newPoem = Poems.insert({
            title:title,
            author:author,
            origObj: poemObjsArray[0],
            puncObj: poemObjsArray[1],
            sentObj: poemObjsArray[2]
        })
        $div = $('<div>')
        $div.attr('title', 'Launch')
        url = window.location.host + '/poem/' + newPoem
        $div.html('Your PoemViz is at ' + url + '<br>')
        $div.dialog({
          resizable: false,
          height:250,
          width:500,
          modal: true,
          buttons: {
            "Go": function() {
              $( this).dialog('close');
              window.open('/poem/'+newPoem, '_blank');
            },
            Cancel: function() {
              $( this ).dialog( "close" );
            }
          }
        })
        Layers.insert({
            name:'Text Options',
            id:'typing0',
            poem_id:newPoem,
            type:'typing'
        });
        Layers.insert({
            name:'Sound',
            id:'color0',
            poem_id:newPoem,
            type:'rhyme'
        });
        Layers.insert({
            name:'Syllables',
            id:'syllable0',
            poem_id:newPoem,
            type:'syllable'
        });
        var sel=Layers.insert({
            name:'Meter',
            id:'stress0',
            poem_id:newPoem,
            type:'stressing',
        });
        
        var selStyle=Styles.insert({poem_id: newPoem, layer_id: 'stress0', verticalAlign:'super'});
        Layers.update(sel, {$set:{style:selStyle}})

    }
})

/*getRandomWord = function(){
  return pgpWordList[Math.floor(Math.random()*pgpWordList.length)][0]
}

Template.teacher.isReady = function(){
  return checkIsReady();  
}

Template.teacher.events({
    'click #submitPoem':function(){
        
var title = $('#title').val();
        var author = $('#author').val();
        var raw=$('#createPoem').val();
        var poemObjsArray = parseHTML(raw);
        var newPoem = Poems.insert({
            title:title,
            author:author,
            origObj: poemObjsArray[0],
            puncObj: poemObjsArray[1],
            sentObj: poemObjsArray[2]
        })
        var key = getRandomWord()
        Shoutkeys.insert({
            key:key,
            poem_id:newPoem
        });
        var selStyle=Styles.insert({poem_id: newPoem, layer_id: 'stress0', verticalAlign:'super'}); 
        Layers.update(sel, {$set:{style:selStyle, keyword: key}});
        function removekey(){
          console.log('removing key')
          Layers.update(sel, {$unset:{style:selStyle, keyword: ''}})  
        }
        Meteor.setTimeout(removekey, 30000);
//        Meteor.setTimeout(removekey, 3600000);             //removes the key after an hour.
        var $div = $('<div>'); 
        $div.attr('title', 'Launch');
        url = window.location.host + '/' + key;
        $div.html('Your exercise is active for one hour at <br>' + url + '<br>');
        $div.dialog({
              resizable: false,
              height:250,
              width:500,
              modal: true,
              buttons: {
                "Go": function() {
                  $( this).dialog('close');
                  Router.go('/'+key, '_blank');
                },
                Cancel: function() {
                  $( this ).dialog( "close" );
                }
              }
          })
//        url = window.location.host + '/poem/' + newPoem
//        $div.html('Your PoemViz is at ' + url + '<br>')
//        $div.dialog({
//          resizable: false,
//          height:250,
//          width:500,
//          modal: true,
//          buttons: {
//            "Go": function() {
//              $( this).dialog('close');
//              Router.go('/poem/'+newPoem, '_blank');
//            },
//            Cancel: function() {
//              $( this ).dialog( "close" );
//            }
//          }
//        })
        Layers.insert({
            name:'Text Options',
            id:'typing0',
            poem_id:newPoem,
            type:'typing'
        });
        Layers.insert({
            name:'Sound',
            id:'color0',
            poem_id:newPoem,
            type:'rhyme'
        });
        Layers.insert({
            name:'Syllables',
            id:'syllable0',
            poem_id:newPoem,
            type:'syllable'
        });
        var sel=Layers.insert({
            name:'Meter',
            id:'stress0',
            poem_id:newPoem,
            type:'stressing',
        });
        
        

    }
})*/

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

