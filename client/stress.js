//how stressing is stored/removed from Selections Collection
//vertical-align:super is styling for stress
stressClick = function(thing){
    var selStyle=Layers.findOne({id:'stress0', poem_id:Session.get('currentPoem')}).style;
    if ($(thing).css('vertical-align') == 'super'){
      getSyllable($(thing).attr('id'));
      for (var i = lastID-1; i >= firstID; i--){
        var idR = Selections.find({poem_id: Session.get('currentPoem'), style_id: selStyle, location: ('#char'+i)}).fetch();
        var idRemove = idR[0]._id;
        Selections.remove(idRemove);  
      }
      if (doLast){
        var idR = Selections.find({poem_id: Session.get('currentPoem'), style_id: selStyle, location: ('#char'+lastID)}).fetch();
        var idRemove = idR[0]._id;
        Selections.remove(idRemove); 
      }
    }else{
      getSyllable($(thing).attr('id'));
      for (var i = lastID-1; i >= firstID; i--){
         Selections.insert({poem_id: Session.get('currentPoem'), style_id: selStyle, location: ('#char'+i), layerNode_id: "stress0"});
      }
      if (doLast){
        Selections.insert({poem_id: Session.get('currentPoem'), style_id: selStyle, location: ('#char'+lastID), layerNode_id: "stress0"});
      }

    }
}

//get closest syllable so stress marks raise syllables
getSyllable = function(location){
    if ($('.syllablesGrid').data('gridded') == false){
        doLast = false;
        if ($("#"+location).hasClass('syllableStyle')){
         var firstLetter = $("#"+location);}
        else{
        var firstLetter = $("#"+location).prevAll('.syllableStyle')[0];}
        console.log(firstLetter);
        if (firstLetter == undefined){
            firstLetter = $("#"+location).closest('.word').children(".syllable:first").children('.letter');
        }
        var lastLetter = $("#"+location).nextAll('.syllableStyle')[0];
        if (lastLetter == undefined){
            lastLetter = $("#"+location).closest('.word').children(".syllable:first").children('.letter').last();
            doLast = true;
        }
        firstID = $(firstLetter).attr('id').substr(4);
        lastID = $(lastLetter).attr('id').substr(4);
    }
    else{
        doLast = true;
        if ($("#"+location).hasClass('syllableStyle')){
         var firstLetter = $("#"+location);}
        else{
            var firstLetter = $("#"+location).closest('.syllable').children(".letter:first");
        }
        var lastLetter = $("#"+location).closest('.syllable').children(".letter:last");
        firstID = $(firstLetter).attr('id').substr(4);
        lastID = $(lastLetter).attr('id').substr(4); 
    }
}


Template.poem.events({
      //delete all stress annotates
      'click .stressClear': function(event){
        var confirmDelete=confirm("Are you sure you want to remove all stress marks?");
        if (confirmDelete == true){
            var selStyle=Layers.findOne({id:'stress0', poem_id:Session.get('currentPoem')}).style;
            $('.letter').each(function(){
               if ($(this).css('vertical-align') == 'super'){
                     $(this).css('vertical-align','baseline');
                     $(this).removeClass('stressStyle')
                     var idR = Selections.find({poem_id: Session.get('currentPoem'), style_id: selStyle, location: '#'+ $(this).attr('id')}).fetch();
                     var idRemove = idR[0]._id;
                     Selections.remove(idRemove);
                }
              });
        }
      },
});