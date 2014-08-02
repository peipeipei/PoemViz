//how stressing is stored/removed from Selections Collection
//vertical-align:super is styling for stress
stressClick = function(thing){
    console.log(firstID);
    console.log(lastID);
    console.log(doLast);
    var selStyle=Layers.findOne({id:Session.get('curLayer'), poem_id:Session.get('currentPoem')}).style;
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
         Selections.insert({poem_id: Session.get('currentPoem'), style_id: selStyle, location: ('#char'+i)});
      }
      if (doLast){
        Selections.insert({poem_id: Session.get('currentPoem'), style_id: selStyle, location: ('#char'+lastID)});
      }
    }
}

//get closest syllable so stress marks raise syllables
getSyllable = function(location){
  console.log('getSyllable called');
    if ($('.syllablesGrid').data('gridded') == false){
        doLast = false;
        if ($("#"+location).css('border-left-color')=='rgb(255, 0, 0)'){
         var firstLetter = $("#"+location);}
        else{
        //var firstLetter = $("#"+location).prevAll('.syllableStyle')[0];}
        var firstLetter = $("#"+location).prevAll('span[style*="border-left-color: red"]')[0];}
        console.log(firstLetter);
        if (firstLetter == undefined){
            firstLetter = $("#"+location).closest('.word').children(".syllable:first").children('.letter');
           // firstLetter = $("#"+location).closest('.word').children('.letter');
        }
        //var lastLetter = $("#"+location).nextAll('.syllableStyle')[0];
        var lastLetter = $("#"+location).nextAll('span[style*="border-left-color: red"]')[0];
        if (lastLetter == undefined){
            lastLetter = $("#"+location).closest('.word').children(".syllable:first").children('.letter').last();
           // lastLetter = $("#"+location).closest('.word').children('.letter').last();
            doLast = true;
        }
        firstID = $(firstLetter).attr('id').substr(4);
        lastID = $(lastLetter).attr('id').substr(4);
        console.log(firstID+ " "+ lastID);
    }
    else{
        doLast = true;
        if ($("#"+location).css('border-left-color')=='rgb(255, 0, 0)'){
         var firstLetter = $("#"+location);}
        else{
            console.log($("#"+location).closest('.syllable'));
        var firstLetter = $("#"+location).closest('.syllable').children(".letter:first");}
        var lastLetter = $("#"+location).closest('.syllable').children(".letter:last");
        firstID = $(firstLetter).attr('id').substr(4);
        lastID = $(lastLetter).attr('id').substr(4); 
    }
}

//contains all the events that happen on the poem page
Template.poem.events({
    //delete all stress annotates
      'click .stressClear': function(event){
        var selStyle=Layers.findOne({id:Session.get('curLayer'), poem_id:Session.get('currentPoem')}).style;
        $('.letter').each(function(){
           if ($(thing).css('vertical-align') == 'super'){
                $(this).css('vertical-align','baseline');
                 $(this).removeClass('stressStyle')
                 var idR = Selections.find({poem_id: Session.get('currentPoem'), style_id: selStyle, location: '#'+ $(this).attr('id')}).fetch();
                 var idRemove = idR[0]._id;
                 Selections.remove(idRemove);
            }
          });
      },
});