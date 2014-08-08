

Template.teacher.isReady = function(){
  //return checkIsReady();  
    return true;
}

Template.teacher.events({
    'click #submitPoem':function(){
        var title = $('#title').val();
        var author = $('#author').val();
        var newPoemGroup = PoemGroups.insert({});
//        var key = getRandomWord()
////        Shoutkeys.insert({
////            key:key,
////            poem_group_id:newPoemGroup
////        });
//        var poemSectionDivs = $('#poemSections').children('.poemSection');
//        for (var i = 1; i <= poemSectionDivs.length; i++){
//            var raw = $(poemSectionDiv).val();
//            var poemObjsArray = parseHTML(raw);
//            var newPoem = Poems.insert({
//                poemGroup: newPoemGroup,
//                poemGroupIndex: i,
//                title:title,
//                author:author,
//                origObj: poemObjsArray[0],
//                puncObj: poemObjsArray[1],
//                sentObj: poemObjsArray[2],
//            });
//            Layers.insert({
//                name:'Text Options',
//                id:'typing0',
//                poem_id:newPoem,
//                type:'typing'
//            });
//            var layer1id = Layers.insert({
//                name:'Sound',
//                id:'color0',
//                poem_id:newPoem,
//                type:'rhyme',
//                opacity: 1,
//                layerArray: colorsSailboat,
//            });
//            // starts the "sound" layer with two default colors
//            Colors.insert({
//                 poem_id:newPoem,
//                 layer_id: layer1id,
//                 color_value: colorsSailboat[0], 
//                 name: 'Editable Color Label'
//            })
//            Colors.insert({
//                 poem_id:newPoem,
//                 layer_id: layer1id,
//                 color_value: colorsSailboat[1], 
//                 name: 'Editable Color Label'
//            })
//            // NOTE: Index only starts at two because two colors have already been assigned to the 'Sound' layer
//            ColorIndices.insert({
//                poem_id:newPoem,
//                index: 2,
//                layer: layer1id
//            });
//            Layers.insert({
//                name:'Syllables',
//                id:'syllable0',
//                poem_id:newPoem,
//                type:'syllable'
//            });
//            var sel=Layers.insert({
//                name:'Meter',
//                id:'stress0',
//                poem_id:newPoem,
//                type:'stressing',
//            });
//        }
//        var $div = $('<div>'); 
//        $div.attr('title', 'Launch');
//        url = window.location.host + '/' + key;
//        $div.html('Your exercise is at <br>' + url + '/[insert section number]<br>');
//        $div.dialog({
//          resizable: false,
//          height:250,
//          width:500,
//          modal: true,
//          buttons: {
//            "Go": function() {
//              $( this).dialog('close');
//               Router.go('/'+key, '_blank');
//            },
//            Cancel: function() {
//              $( this ).dialog( "close" );
//            }
//          }
//        })
        
        
        
        var raw=$('#createPoem').val();
        var poemObjsArray = parseHTML(raw);
        var newPoem = Poems.insert({
            poemGroup: newPoemGroup,
            title:title,
            author:author,
            origObj: poemObjsArray[0],
            puncObj: poemObjsArray[1],
            sentObj: poemObjsArray[2],

        });
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
        
        var selStyle=Styles.insert({poem_id: newPoem, layer_id: 'stress0', verticalAlign:'super'}); 
        Layers.update(sel, {$set:{style:selStyle, keyword: key}});
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
  var shoutAttempt = pgpWordList[Math.floor(Math.random()*pgpWordList.length)][0];
  while (Shoutkeys.find({key: shoutAttempt}).fetch().length > 0){
      shoutAttempt = pgpWordList[Math.floor(Math.random()*pgpWordList.length)][0];
  }
  return shoutAttempt; 
}

