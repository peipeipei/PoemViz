//contains all the events that happen on the poem page
Template.poem.events({
    'click .layer': function(event){
//        console.log($(event.currentTarget).attr('id'));
        Session.set("curLayer", $(event.currentTarget).attr('id'));
        console.log('click layer is called');
    },
    
    'click #questionMark': function(event){
        var $div = $('<div>'); 
        $div.attr('title', 'How to PoemViz');
        $div.html('To highlight text: <br> Click on the layer (one of the boxes in the rightmost column) with colored squares stacked vertically. Click on the color you would like to use and then click on the line you would like to highlight. If you would rather highlight words or letters, select those options from the drop-down menu. If none of the colors appeal to you, click on the \"+\" button for more complimentary colors. If this particular color scheme isn\'t really your thing, click the \"Add a Layer\" button at the bottom, select \"Other Coloring\", and a new layer with new colors will be available for highlighting. You can also label these color layers and the colors they contain by clicking on their current labels. <br> <br> To mark syllables: <br> Click on the layer with label \"Syllable\". Move your cursor close to the letter you wish to insert a syllable mark before, and a temporary ghost marker will help you place the cursor in the correct place. Click, and a black line will be inserted. To remove the syllable marker, click in the same place again. You may toggle the visibility of all syllables on and off, clear all of the marks, and display the syllables in a grid with cells of equal width. <br> <br> To make stress marks: <br> Click on the layer with label \"Meter\". Click on any letter in the syllable you would like to be stressed, and that syllable will be raised higher than the surrounding syllables. To remove the stress, click in the same place again. You may toggle the visibility of all of the stress marks on and off and clear all of the stress marks. <br> <br> To view the poem with no words: <br> Click on the layer with label \"Text Options\". Click the \"Turn Text\" button to toggle the non-bolded poem text on and off. <br> <br> To view the poem with different line breaks: <br> Click on the layer with label \"Text Options\". Select what you would like to determine line breaks in the poem. Only the original view is editable, but all markings on the original view will be preserved in the other views. <br> <br> To bold text: <br> Click the \"Add a Layer\" button at the bottom, select \"Other Bolding\", and a new layer with new colors will be available for bolding. Bold just as you would highlight. <br> <br> To share with friends: <br> Give them the shortened url at the top of the page. The poem will be available at this url for only an hour, but it will permanently be available at the weird address with lots of letters and numbers in the url. <br> <br> To be awesome: <br> Get started! :) ');
        $div.dialog({
          resizable: false,
          height:750,
          width:750,
          modal: true,
          /*buttons: {
            Cancel: function() {
              $( this ).dialog( "close" );
            }
          }*/
        })
    },

    'blur .layerName':function(event){
        console.log('blurred');
        var layerID=$(event.currentTarget).parent().attr('id');
        var curL_id=Layers.findOne({poem_id: Session.get('currentPoem'), id:layerID})._id;
        var newName=$(event.currentTarget).text();
        Layers.update(curL_id, {$set: {name: newName}});
    },
     'blur .colorName': function(event){
        var layerNodeID=$(event.currentTarget).closest('.layer').attr('id');
        var curL_id=Layers.findOne({poem_id: Session.get('currentPoem'), id:layerNodeID})._id;
        console.log(curL_id);
        var colorsquare = $(event.currentTarget).prev('.colorSquare');
        console.log(colorsquare);
        var curColor = $(colorsquare).css("backgroundColor").trim();
        //curColor is rgb??
        var substring = curColor.substr(4);
        substring = substring.slice(0, -1);
        var curRGBA = 'rgba('+substring+', 1)';
        curRGBA = curRGBA.split(' ').join('');
        console.log(curRGBA);
        var colorID = Colors.findOne({poem_id: Session.get('currentPoem'), layer_id: curL_id, color_value: curRGBA})._id;
        console.log(colorID);
        var newName=$(event.currentTarget).text();
        Colors.update(colorID, {$set: {name: newName}});    
    },
    //when user clicks a line and the line mode of highlighting or bolding is selected 
    'click .line':function(event){
        if(Session.get('selectedType')=='rhyme' && Session.get('highlightElement')=='line'){
            colorClick(event.currentTarget);
          }
          if(Session.get('selectedType')=='bold' && Session.get('boldElement')=='boldLine'){
            boldClick(event.currentTarget);
        }
    },
        //allows user to hide/show the syllable marks or stressing
      'change .visibility': function(event){
        var idFull = this._id;
        var visible=$(event.currentTarget).is(':checked');
        if($(event.currentTarget).data('layer') =='syllable'){
            if(visible){
                Session.set('syllablesVisible', 'true');
                $('.syllable').css('min-width', '65px');
                $('.letter, .space').each(function(){
                    console.log('hi');
                //must make sure we give this data attribute to other users
                if ($(this).hasClass('syllableStyle')){
                    console.log('syllable');
                    $(this).css('border-left', '2px solid black');
                }
                });
                $('.lineCount').css('opacity','1.0');
                $('.syllableCount').css('color','blue')
            }
            else{
                Session.set('syllablesVisible', 'false');
                $('.syllableCount').css('color','white')
                $('.syllable').css('min-width', '0px');
                $('.letter, .space').each(function(){
                    $(this).css('border-left', 'none');
                });
                $('.lineCount').css('opacity','0.0');
            }
        }
        if($(event.currentTarget).data('layer') =='stressing'){
            if(visible){
                Session.set('stressVisible', 'true');
                $('.letter, .word').each(function(){
                //must make sure we give this data attribute to other users
                if ($(this).hasClass('stressStyle') === true){
                    $(this).css('vertical-align', 'super');
                }
                });
            }
            else{
                Session.set('stressVisible', 'false');
                $('.letter, .word').each(function(){
                    $(this).css('vertical-align', 'baseline');
                });
            }
        }
    },
    
    //when user clicks a word and the word mode of highlighting or bolding is selected 
    'click .word':function(event){
        if(Session.get('selectedType')=='rhyme' && Session.get('highlightElement')=='word'){
            colorClick(event.currentTarget);
        }
        if(Session.get('selectedType')=='bold' && Session.get('boldElement')=='boldWord'){
            boldClick(event.currentTarget);
        }
    },
    
    //when user clicks a letter/space (character) and the "letter" mode of highlighting or bolding is selected 
    'click .letter, .space':function(event){
        if (Session.get('selectedType')=='syllable'){
            clickSyllable(event.currentTarget);
        }
        if(Session.get('selectedType')=='rhyme' && Session.get('highlightElement')=='letter'){
            colorClick(event.currentTarget);
          }
          if(Session.get('selectedType')=='bold' && Session.get('boldElement')=='boldLetter'){
            boldClick(event.currentTarget);
        }
        if (Session.get('selectedType')=='stressing'){
            stressClick(event.currentTarget);
            console.log($(event.currentTarget).attr('id')+'CLICKED!!');
        }
    },
    
//    scroll bar function
    'click .layers-menu':function(event){
        var scrolledPos = $("#layers").scrollTop();
        var parentPadding = $(".dropdown").parent().innerWidth() - $(this).parent().width();
        var parentHeight = $(".dropdown").parent().height() - parentPadding;
        $("#layers").animate({ scrollTop: scrolledPos + parentHeight}, "fast");
    
    }
});


