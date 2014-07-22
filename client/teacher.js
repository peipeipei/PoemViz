Template.teacher.isReady = function(){
  return checkIsReady();  
}

function parseHTML(raw){
    var arr=raw.split('\n');
    var spanned=[];
    var lineCounter=0,
        wordCounter=0,
        charCounter=0;
    arr.forEach(function(v, i){
      var elements = v.split('');
      var p=$('<p class="poemLine">');
      var line = $('<span class="line col-md-11">');
      line.attr("id","line"+ lineCounter);
      $(p).append(line);
      lineCounter++;
      for (var i = 0; i < elements.length; i++) {
          if (elements[i-1] === ' ' || i === 0){
              var syllable=$('<span class=syllable>')
              var word = $('<span class=word>');
              word.attr("id", "word"+wordCounter);
              wordCounter++;
              $(word).append(syllable);
              $(line).append(word);
          }
          if (elements[i] === ' '){
              var space = $('<span class=space>' + elements[i] + '</span>');
              space.attr("id", "char"+charCounter);
              $(line).append(space);
              charCounter++;
          } 
          else{
              var letter = $('<span class=letter>' + elements[i] + '</span>');
              letter.attr("id", "char"+charCounter);
              $(syllable).append(letter);
              charCounter++;

          }
          if (i == elements.length - 1){
              //make linebreak space wide enough to prepend breaks to
              //only works if no spaces at end of line already!
              var linebreak = $('<span class=space > </span>');
              linebreak.css('padding-left', '1px');
              $(line).append(linebreak);
           }
      }
      var lineCount = $('<span class=lineCount style="color:blue; font-weight:bold">');
      $(lineCount).text($(p).text().split(' ').length-1);
      $(p).append(lineCount);
      spanned.push($(p)[0].outerHTML);
    })
    var longest='';
    spanned.forEach(function(v,i){
      longest += v;
    })
    return longest;
}

Template.teacher.events({
    'click #submitPoem':function(){
        var raw=$('#createPoem').val();
        var html=parseHTML(raw);
        var newPoem=Poems.insert({htmlContent:html});
        $div = $('<div>')
        $div.attr('title', 'Launch')
        url = window.location.host + '/poem/' + newPoem
        $div.html('Your PoemViz is at ' + url + '<br>')
        $div.dialog({
          resizable: false,
          height:250,
          width:500,
          modal: true,
          buttons: {
            "Go": function() {
              $( this).dialog('close');
              window.open('/poem/'+newPoem, '_blank');
            },
            Cancel: function() {
              $( this ).dialog( "close" );
            }
          }
        })
        Layers.insert({
          name:'Rhyme',
          id:'color0',
          poem_id:newPoem,
          type:'rhyme'
        });
        Layers.insert({
          name:'Syllables',
          id:'syllable0',
          poem_id:newPoem,
          type:'syllable'
        });
   
        
    }
})