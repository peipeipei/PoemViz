
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
         function removekey(){
          console.log('removing key')
          Layers.update(sel, {$unset:{style:selStyle, keyword: ''}})  
        }
        // Shorter version is for testing
//        Meteor.setTimeout(removekey, 30000);
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
              window.open('/'+key, '_blank');
//                Router.go('/'+key, '_blank');
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
        Layers.update(sel, {$set:{style:selStyle, keyword: key}});

    }
})

getRandomWord = function(){
  return pgpWordList[Math.floor(Math.random()*pgpWordList.length)][0]
}

    