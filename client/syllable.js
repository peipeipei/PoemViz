//contains events that happen on the poem page
Template.poem.events({
    //clears all syllable marks
    'click .syllablesClear': function(event){
            var confirmDelete=confirm("Are you sure you want to remove all syllable marks?");
            if (confirmDelete == true){
                $('.letter, .space').each(function(){
                    if ($(this).hasClass('syllableStyle')){
                        $(this).css('border-left', 'none');
                    }
                });
                $('.poemLine').each(function(){
                    var lineSpan = this;
                    var countSpan = $(lineSpan).find('.lineCount');
                    var count = $(countSpan).text();
                    $(countSpan).text($(lineSpan).find('.word').length);
                })
                   var idR = SyllableMarkers.find({poem_id: curPoem}).fetch();
                   for (var i = 0; i < idR.length; i++){
                        SyllableMarkers.remove(idR[i]._id);
                       
                   }
            }
          
        },
        //when user mouses over possible place to put syllable mark, syllable mark preview (gray ghostmarker) is shown
        'mouseover .letter, .space': function(event){
            if (Session.get('selectedType')=='syllable'){
                if ($(event.currentTarget).prev().hasClass('letter')||$(event.currentTarget).prev().prev().hasClass('letter')){
                ghostMarker(event.currentTarget);}
            }
        },

        //on mouseout, remove syllableMarker/ghostMarker preview
        'mouseout .letter, .space':function(event){
            if (Session.get('selectedType')=='syllable'){
                noghostMarker(event.currentTarget);
            }
        },
        //clicking "grid" button in syllable layer
        'click .syllablesGrid': function(event){
            grid();
        }
});

//grid putting syllables in columns of equal width
grid = function(){
    if ($('.syllablesGrid').data('gridded')===false){
        $('.syllable').each(function(){
            console.log("syllable: " + this);
            var letters=$(this).find('.letter');
            console.log("letters: " + letters);
            var intervals=[];
            letters.each(function(){
                if ($(this).hasClass('syllableStyle')){
                    intervals.push(parseInt($(this).attr('id').slice(4),10));
                }
            })
            if (intervals[0] != $(letters[0]).attr('id')){
                intervals.unshift(parseInt($(letters[0]).attr('id').slice(4),10));
            }
            console.log((letters.length));
            var last=(parseInt($(letters[(letters.length) - 1]).attr('id').slice(4),10)+1)
            intervals.push(last);
            console.log("last: " + last);
            var oldSyl=$(this);
            var beginning=intervals[0];
            console.log("beginning: " + beginning)
            var endest=intervals[intervals.length-1];
            var moreSyls=$('<div>');
            intervals.forEach(function(end){
              if(end !== beginning){
                var newSyl=$('<span class=syllable>');
                for (i=beginning; i<end;i++){
                  var newLetter=$('<span class=letter>');
                  $(newLetter).attr('id','char'+i);
                  $(newLetter).text(oldSyl.find('#char'+i).text());
                  $(newSyl).append(newLetter);
                  if(i==beginning && i!==intervals[0]){
                    $(newLetter).addClass('syllableStyle');
                  }
                }
                $(moreSyls).append(newSyl);
                beginning=end;
              }
            })
            $(oldSyl).replaceWith($(moreSyls).html())
        });
        $('.syllable').each(function(){
            //if this isn't last child of word
            if (!($(this).is(':last-child'))){
                $(this).append('<span class=extraHyphen>-</span>');
        }
        });
        $('.syllable').css('display', 'inline-block');
        $('.syllable').css('min-width', '60px');
        $('.syllablesGrid').data('gridded',true);
    }else{
        $('.word').each(function(){
          var letters=$(this).find('.letter');
          $(this).find('.syllable').remove();
          var oneSyl=$('<span class=syllable>');
          letters.each(function(){
            $(oneSyl).append(this);
          })
          $(this).append(oneSyl);
       });
        $('#leftSide').remove('.extraHyphen');
        $('.syllable').css('display', 'inline');
        $('.syllable').css('min-width', '0');
        $('.syllablesGrid').data('gridded',false);
    }
}

//must update syllableMarkers
ghostMarker = function(thing) {
       if ($(thing).css('border-left-color') == 'rgb(255, 0, 0)'){}
       else{
       $(thing).css('border-left', '2px solid gray');} 
}
//must update syllableMarkers
noghostMarker = function(thing) {
       if ($(thing).css('border-left-color') =='rgb(255, 0, 0)'){}
      else{ 
      $(thing).css('border-left', 'none');} 
}

//must update syllableMarkers
clickSyllable = function(thing) {
    if ($(thing).css('border-left-color') == "rgb(255, 0, 0)"){
        $(thing).css('border-left', 'none');
        var syl = SyllableMarkers.find({location: $(thing).attr("id"), poem_id: curPoem}).fetch(); 
        SyllableMarkers.remove(syl[0]._id);
    }
    else{
        //don't allow user to place marks 
        if ($(thing).prev().hasClass('letter')||$(thing).prev().prev().hasClass('letter')){
        $(thing).css('border-left', '3px solid red');
        SyllableMarkers.insert({location: $(thing).attr("id"), poem_id: curPoem});}
    }

}  

//stop reacting to syllable events when user selects other layer (that isn't syllable)
stopSyllables = function(){
    $('.poem').off("mouseover", ".letter, .space", ghostMarker);
    $('.poem').off("mouseout", ".letter, .space", noghostMarker);
    $('.poem').off("click", ".letter, .space", clickSyllable);
}

