//contains all the events that happen on the poem page
Template.poem.events({
    'click .layer': function(event){
        console.log($(event.currentTarget).attr('id'));
        Session.set("curLayer", $(event.currentTarget).attr('id'));
    },

    //stores name of custom layer
    //updates the layer database with the new name after user stops typing
    'keyup .layerName':function(event){
        var layerID=$(event.currentTarget).parent().attr('id');
        var curL_id=Layers.findOne({poem_id: curPoem, id:layerID})._id;
        typewatch(function () {
            var newName=$(event.currentTarget).text();
            Layers.update(curL_id, {$set: {name: newName}});
            console.log(curL_id);
        }, 1000);
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
                $('.syllable').css('min-width', '65px');
                $('.letter, .space').each(function(){
                    console.log('hi');
                //must make sure we give this data attribute to other users
                if ($(this).hasClass('syllableStyle')){
                    console.log('syllable');
                    $(this).css('border-left', '3px solid red');
                }
                });
                $('.lineCount').css('opacity','1.0');
                $('#syllableCount').css('color','blue')
            }
            else{
                $('#syllableCount').css('color','white')
                $('.syllable').css('min-width', '0px');
                $('.letter, .space').each(function(){
                    $(this).css('border-left', 'none');
                });
                $('.lineCount').css('opacity','0.0');
            }
        }
        if($(event.currentTarget).data('layer') =='stressing'){
            if(visible){
                $('.letter, .word').each(function(){
                //must make sure we give this data attribute to other users
                if ($(this).hasClass('stressStyle') === true){
                    $(this).css('vertical-align', 'super');
                }
                });
            }
            else{
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
