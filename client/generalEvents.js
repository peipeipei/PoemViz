//contains all the events that happen on the poem page
Template.poem.events({
    'click .layer': function(event){
//        console.log($(event.currentTarget).attr('id'));
        Session.set("curLayer", $(event.currentTarget).attr('id'));
        console.log('click layer is called');
    },

    //stores name of custom layer
    //updates the layer database with the new name after user stops typing
   /* 'keyup .layerName':function(event){
        var layerID=$(event.currentTarget).parent().attr('id');
        var curL_id=Layers.findOne({poem_id: Session.get('currentPoem'), id:layerID})._id;
        typewatch(function () {
            var newName=$(event.currentTarget).text();
            Layers.update(curL_id, {$set: {name: newName}});
            console.log(curL_id);
        }, 3000);
    },
    'keyup .colorName':function(event){
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
        typewatch(function () {
            var newName=$(event.currentTarget).text();
            Colors.update(colorID, {$set: {name: newName}});
        }, 3000);
    },*/
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


