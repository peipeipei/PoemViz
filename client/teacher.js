
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
            sentObj: poemObjsArray[2],
        });
        var key = getRandomWord();
        Shoutkeys.insert({
            poem_id:newPoem,
            key:key
        });
        
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
        Layers.insert({
            name:'Text Options',
            id:'typing0',
            poem_id:newPoem,
            type:'typing'
        });
        var layer1id = Layers.insert({
            name:'Sound',
            id:'color0',
            poem_id:newPoem,
            type:'rhyme'
        });
        // NEW STUFF
        Colors.insert({
             poem_id:newPoem,
             layer_id: layer1id,
             color_value: colors[0], 
             name: 'color label'
        })
        Colors.insert({
             poem_id:newPoem,
             layer_id: layer1id,
             color_value: colors[1], 
             name: 'color label'
        })
        // NOTE: Index only starts at two because two colors have already been assigned to the 'Sound' layer
        ColorIndices.insert({
            poem_id:newPoem,
            index: 2
        });
        // END NEW STUFF
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
