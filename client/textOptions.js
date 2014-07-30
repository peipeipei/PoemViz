//contains all the events that happen on the poem page
Template.poem.events({
       //function of "Text Options" ('typing') layer
  'click .wordOption': function(event){
    if($('.wordOption').data('active')){
            $('#leftSide').css('color', 'rgba(0,0,0,1)');
            $('.wordOption').text('Turn Text Off');
            $('.wordOption').data('active', false);
        }else{
            $('#leftSide').css('color', 'rgba(0,0,0,0)');
            $('.wordOption').text('Turn Text On');
            $('.wordOption').data('active', true);
        }
    },
  
  //in "Text Options" ('typing') layer, allow user to seperate poem by punctuation marks
'click .puncOption': function(event){
    //RIGHT NOW, makes new line/word/character spans (but she doesn't want this)
    //instead, make such that line/word/letter spans are maintained, only new line breaks are made
    
    //used to make id's for lines, words, characters
    var lCounter=0,
        wCounter=0,
        cCounter=0;
    if($('.puncOption').data('active')){
            //what should happen when user has already clicked the button
        }else{
        /*
            $('.puncOption').data('active', true);
            var poemtext = "";
            $(".line").each(function() {
                poemtext += $(this).text();
            })
            var punc = poemtext.match(/[,.?!;:]|-\s/g);
            var text = poemtext.split(/[,.?!;:]|-\s/g) ;
            var wholeArray = [];
            for (var i = 0; i < punc.length; i++){
                wholeArray.push(text[i]+ punc[i]);
            }
            $('#leftSide .poemLine').remove();
            for (var t = 0; t < wholeArray.length; t++) {
                var line = $('<p class="poemLine">');
                var inside = $('<span class="line col-md-11">');
                inside.attr("id","line"+ lCounter);
                $('#leftSide').append(line);
                lCounter++;
                $(line).append(inside);
                var elements = wholeArray[t].trim();
                for (var i = 0; i < elements.length; i++) {
                if (elements[i-1] === ' ' || i === 0){
                    var syllable=$('<span class=syllable>')
                    var word = $('<span class=word>');
                    word.attr("id", "word"+wCounter);
                    $(word).append(syllable);
                    $(inside).append(word);
                    wCounter++;
                }
                if (elements[i] === ' '){
                     var space = $('<span class=space>' + elements[i] + '</span>');
                     space.attr("id", "char"+cCounter);
                     $(inside).append(space);
                     cCounter++;
                } 
                else{
                   var letter = $('<span class=letter>' + elements[i] + '</span>');
                   letter.attr("id", "char"+cCounter);
                   $(syllable).append(letter);
                   cCounter++;
                }
                if (i == elements.length - 1){
                    //make linebreak space wide enough to prepend breaks to
                    //only works if no spaces at end of line already!
                    var linebreak = $('<span class=space > </span>');
                    linebreak.css('padding-left', '1px');
                    $(inside).append(linebreak);
                 }
            }
            var lineCount = $('<span class=lineCount style="color:blue; font-weight:bold">');
            $(lineCount).text($(line).text().split(' ').length-1);
            $(line).append(lineCount);
            }
            var poemHTML = $("#leftSide").html();
            $('#leftSide').html("");
            console.log(poemHTML);
            Poems.update(curPoem, {htmlContent: poemHTML});
            location.reload();*/
 }} });