

Template.teacher.isReady = function(){
  //return checkIsReady();  
    return true;
}

Template.teacher.events({
    'click #submitPoem':function(){
        var title = $('#title').val();
        var author = $('#author').val();
        var poemGroupPoemSectionIDs = [];
        var newPoemGroup = PoemGroups.insert({poems:poemGroupPoemSectionIDs});
        var key = getRandomWord()
        var poemSectionDivs = $('#poemSections').children('.poemSection');
        for (var i = 0; i < poemSectionDivs.length; i++){
            var poemSectionDiv = poemSectionDivs[i];
            var raw = $(poemSectionDiv).val();
            console.log("raw");
            console.log(raw);
            var poemObjsArray = parseHTML(raw);
            var newPoem = Poems.insert({
                poemGroup: newPoemGroup,
                poemGroupIndex: i,
                title:title,
                author:author,
                origObj: poemObjsArray[0],
                puncObj: poemObjsArray[1],
                sentObj: poemObjsArray[2],
            });
            Shoutkeys.insert({
                key:key,
                index: i,
                poem_id:newPoem,
            });
            poemGroupPoemSectionIDs.push(newPoem);
            console.log("key");
            console.log(key);
            console.log(Poems.find().fetch());

            var layer1id = Layers.insert({
                name:'Sound',
                id:'color0',
                poem_id:newPoem,
                type:'rhyme',
                opacity: 1,
                layerArray: colorsSailboat,
            });
            // starts the "sound" layer with two default colors
            Colors.insert({
                 poem_id:newPoem,
                 layer_id: layer1id,
                 color_value: colorsSailboat[0], 
                 name: 'Editable Color Label'
            })
            Colors.insert({
                 poem_id:newPoem,
                 layer_id: layer1id,
                 color_value: colorsSailboat[1], 
                 name: 'Editable Color Label'
            })
            Styles.insert({poem_id: newPoem, layer_id: 'color0', background_color: colorsSailboat[0]});
        
            Styles.insert({poem_id: newPoem, layer_id: 'color0', background_color: colorsSailboat[1]});
            // NOTE: Index only starts at two because two colors have already been assigned to the 'Sound' layer
            ColorIndices.insert({
                poem_id:newPoem,
                index: 2,
                layer: layer1id
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
            Layers.insert({
            name:'Text Options',
            id:'typing0',
            poem_id:newPoem,
            type:'typing'
        }); 
            
              var selStyle=Styles.insert({poem_id: newPoem, layer_id: 'stress0', verticalAlign:'super'}); 
        Layers.update(sel, {$set:{style:selStyle, keyword: key}});
        }
        PoemGroups.update(newPoemGroup, {$set:{poems:poemGroupPoemSectionIDs}});
        console.log("poemGroupPoemSectionIDs");
        console.log(poemGroupPoemSectionIDs);
        console.log("poem group");
        console.log(PoemGroups.findOne({_id:newPoemGroup}));
        var $div = $('<div>'); 
        $div.attr('title', 'Launch');
        url = window.location.host + '/' + key;
        $div.html('Your exercise is at <br>' + url + '/[insert section number]<br>');
        $div.dialog({
          resizable: false,
          height:250,
          width:500,
          modal: true,
          buttons: {
            "Go": function() {
              $( this).dialog('close');
               Router.go('/'+key + '/' + '0', '_blank');
            },
            Cancel: function() {
              $( this ).dialog( "close" );
            }
          }
        })
     
    },
    
    'click #newPoemSection':function(){
        var poemSectionsDiv = $('#poemSections');
        var poemSectionLabel  = $('<div>Poem Section: </div>');
        var poemSection = $('<textarea>');
        poemSection.attr('class', 'poemSection');
        poemSectionsDiv.append(poemSectionLabel);
        poemSectionsDiv.append(poemSection);
    }
    


})

getRandomWord = function(){
    var numshoutkeys = pgpWordList.length;
    //will be an integer between 0 (inclusive) and numshoutkeys (exclusive)
    //fun to keep iteration random
    var offset = Math.floor(Math.random()*numshoutkeys);
    var shoutkeyAvailable = false;
    for (var i = 0; i < numshoutkeys; i++){
        var shoutAttempt = pgpWordList[(i+(offset)) % numshoutkeys][0];
        if (Shoutkeys.find({key: shoutAttempt}).fetch().length == 0){
            shoutkeyAvailable = true;
            break;
        }
    }
    if (shoutkeyAvailable){
    return shoutAttempt; 
    }
    else{
     return "no shoutkeys available!"
    }
}

