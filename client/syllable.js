Template.poem.events({
    //clears all syllable marks
    'click .syllablesClear': function(event){
            var confirmDelete=confirm("Are you sure you want to remove all syllable marks?");
            if (confirmDelete == true){
                $('.letter, .space').each(function(){
                    if ($(this).hasClass("syllableStyle")){
                        $(this).css('border-left', 'none');
                    }
                });
                $('.line').each(function(){
                    var lineSpan = this;
                    var countSpan = $(lineSpan).find('.lineCount');
                    var count = $(countSpan).text();
                    $(countSpan).text($(lineSpan).find('.word').length);
                })
                   var idR = SyllableMarkers.find({poem_id: Session.get('currentPoem')}).fetch();
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
            var letters=$(this).find('.letter');
            var intervals=[];
            letters.each(function(){
                if ($(this).hasClass("syllableStyle")){
                    intervals.push(parseInt($(this).attr('id').slice(4),10));
                }
            })
            if (intervals[0] != $(letters[0]).attr('id')){
                intervals.unshift(parseInt($(letters[0]).attr('id').slice(4),10));
            }
            if (letters.length > 0){
                var last=(parseInt($(letters[(letters.length) - 1]).attr('id').slice(4),10)+1);
                intervals.push(last);
                var oldSyl=$(this);
                var beginning=intervals[0];
                var endest=intervals[intervals.length-1];
                var moreSyls=$('<div>');
                intervals.forEach(function(end){
                  if(end !== beginning){
                    var newSyl=$('<span class=syllable>');
                    for (i=beginning; i<end;i++){
                          var newLetter=$('<span class=letter>');
                          $(newLetter).attr('id','char'+i);
                          $(newLetter).text(oldSyl.find('#char'+i).text());
                          if ($('#char'+i).css('vertical-align')=='super'){
                              newLetter.css('vertical-align','super');
                      }
                       newLetter.addClass($('#char'+i).attr("class"));
                       newLetter.css('background-color', $('#char'+i).css('background-color'));
                       newLetter.css('color', $('#char'+i).css('color'));
                       newLetter.css('font-weight', $('#char'+i).css('font-weight'));
                      $(newSyl).append(newLetter);
                      if(i==beginning && i!==intervals[0]){
                        $(newLetter).css('border-left','2px solid black');
                      }
                    }
                    $(moreSyls).append(newSyl);
                    beginning=end;
                  }
                })
                $(oldSyl).replaceWith($(moreSyls).html())
            }
        });
        $('.syllable').each(function(){
            //if this isn't last child of word
            var word = $(this).closest('.word');
            var sylArray = $(word).find('.syllable');
            var lastIndex = sylArray.length - 1;
            if (!($(this).is('span .syllable:last-child'))){
                var lett = $(this).find('.letter')[0];
                if ($(lett).css('vertical-align')=='super'){
                    $(this).append('<span class=extraHyphen style="vertical-align: super;">-</span>');}
                else{
                   $(this).append('<span class=extraHyphen>-</span>');} 
        }
        });
        $('.syllable').css('display', 'inline-block');
        $('.syllable').css('min-width', '60px');
        $('.syllablesGrid').data('gridded',true);
        $('.syllablesGrid').text('Un-Grid');
    }
    else{
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
        $('.syllablesGrid').text('Grid');
    }
}

//must update syllableMarkers
ghostMarker = function(thing) {
       if ($(thing).hasClass('syllableStyle')){}
       else{
       $(thing).css('border-left', '2px solid gray');} 
}
//must update syllableMarkers
noghostMarker = function(thing) {
      if ($(thing).hasClass('syllableStyle')){}
      else{ 
      $(thing).css('border-left', 'none');} 
}

//must update syllableMarkers
clickSyllable = function(thing) {
    if ($(thing).hasClass("syllableStyle")){
        $(thing).css('border-left', 'none');
        var syl = SyllableMarkers.find({location: $(thing).attr("id"), poem_id: Session.get('currentPoem')}).fetch(); 
        SyllableMarkers.remove(syl[0]._id);                             
    }
    else{
        //don't allow user to place marks 
        if ($(thing).prev().hasClass('letter')||$(thing).prev().prev().hasClass('letter')){
        $(thing).css('border-left', '2px solid black');
        SyllableMarkers.insert({location: $(thing).attr("id"), poem_id: Session.get('currentPoem')});}
    }

}  

//stop reacting to syllable events when user selects other layer (that isn't syllable)
stopSyllables = function(){
    $('.poem').off("mouseover", ".letter, .space", ghostMarker);
    $('.poem').off("mouseout", ".letter, .space", noghostMarker);
    $('.poem').off("click", ".letter, .space", clickSyllable);
}

//update the blue syllable counters at the right of lines
syllableCounts = function(){
        $('.line').each(function() {    
            var existingCounter = 0;
            var letterArray = $(this).find('.letter');
            _.each(letterArray, function(elem) {
            if ($(elem).hasClass("syllableStyle")){
                existingCounter++;
            }
        });
        var lineCount = $(this).find('.lineCount');
        if($(this).text().trim() == ""){
            $(lineCount).text("");
        }
        else{
            $(lineCount).text(($(this).find('.word').length)+existingCounter);
        }
        });
       $('.unnaturalLine').each(function() { 
            var existingCounter = 0;
            var letterArray = $(this).find('.letter');
            _.each(letterArray, function(elem) {
                if ($(elem).css('border-left-color') == 'black' || $(elem).hasClass("syllableStyle")){
                    existingCounter++;
                    console.log($(elem));
                }
        });
        var lineCount = $(this).find('.lineCount');
        if($(this).text().trim() == ""){
            $(lineCount).text("");
        }
        else{
            var wordArray = $(this).find('.word');
            var validWordCounter = 0;
            //don't count the awkward spaces created by new lines
            _.each(wordArray, function(elem) {
                if ($(elem).text().trim() == ""){
                }
                else{
                  validWordCounter++;
                }
            });
          $(lineCount).text(validWordCounter+existingCounter);  
        }
    });
}

