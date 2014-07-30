//how stressing is stored/removed from Selections Collection
stressClick = function(thing){
    console.log(firstID);
    console.log(lastID);
    console.log(doLast);
    var selStyle=Layers.findOne({id:Session.get('curLayer'), poem_id:Session.get('currentPoem')}).style;
    if ($(thing).hasClass('stressStyle')){
      getSyllable($(thing).attr('id'));
      for (var i = lastID-1; i >= firstID; i--){
        var idR = Selections.find({poem_id: curPoem, style_id: selStyle, location: ('#char'+i)}).fetch();
        var idRemove = idR[0]._id;
        Selections.remove(idRemove);  
      }
      if (doLast){
        var idR = Selections.find({poem_id: curPoem, style_id: selStyle, location: ('#char'+lastID)}).fetch();
        var idRemove = idR[0]._id;
        Selections.remove(idRemove); 
      }
    }else{
      getSyllable($(thing).attr('id'));
      for (var i = lastID-1; i >= firstID; i--){
          console.log('#char'+i);
         Selections.insert({poem_id: curPoem, style_id: selStyle, location: ('#char'+i)});
      }
      if (doLast){
          console.log('#char'+lastID+'LAST!');
        Selections.insert({poem_id: curPoem, style_id: selStyle, location: ('#char'+lastID)});
      }
    }
}

//get closest syllable so stress marks raise syllables
getSyllable = function(location){
  console.log('getSyllable called');
        doLast = false;
        if ($("#"+location).hasClass('syllableStyle')){
         var firstLetter = $("#"+location);}
        else{
        var firstLetter = $("#"+location).prevAll('.syllableStyle')[0];}
        if (firstLetter == undefined){
            firstLetter = $("#"+location).closest('.word').children(":first").children('.letter');
        }
        var lastLetter = $("#"+location).nextAll('.syllableStyle')[0];
        if (lastLetter == undefined){
            lastLetter = $("#"+location).closest('.word').children(":first").children('.letter').last();
            doLast = true;
        }
        firstID = $(firstLetter).attr('id').substr(4);
        lastID = $(lastLetter).attr('id').substr(4);
}

//contains all the events that happen on the poem page
Template.poem.events({
    //delete all stress annotates
      'click .stressClear': function(event){
        var selStyle=Layers.findOne({id:Session.get('curLayer'), poem_id:Session.get('currentPoem')}).style;
        $('.letter').each(function(){
           if ($(this).hasClass('stressStyle')){
                $(this).removeClass('stressStyle');
                 var idR = Selections.find({poem_id: curPoem, style_id: selStyle, location: '#'+ $(this).attr('id')}).fetch();
                 var idRemove = idR[0]._id;
                 Selections.remove(idRemove);
            }
          });
      },
});