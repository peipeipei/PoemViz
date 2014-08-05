

Template.teacher.isReady = function(){
  //return checkIsReady();  
    return true;
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
            sentObj: poemObjsArray[2],
        })
        var key = getRandomWord()
        Shoutkeys.insert({
            key:key,
            poem_id:newPoem
        });
        var $div = $('<div>'); 
        $div.attr('title', 'Launch');
        url = window.location.host + '/' + key;
        $div.html('Your exercise is at <br>' + url + '<br>');
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
            type:'rhyme',
            opacity: 1,
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
  var shoutAttempt = pgpWordList[Math.floor(Math.random()*pgpWordList.length)][0];
  while (Shoutkeys.find({key: shoutAttempt}).fetch().length > 0){
      shoutAttempt = pgpWordList[Math.floor(Math.random()*pgpWordList.length)][0];
  }
  return shoutAttempt; 
}