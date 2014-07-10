var colors=['Yellow', 'LightBlue', 'LightPink', 'LightGreen', 'Plum', 'LightSalmon'];
var highlightColor='';
var highlighting=false;

$(document).ready(function(){
    
    //make each alphanumeric character/space/word/line a span with seperate class
    $('.poemLine').each(function(){
        console.log('hi');
        var elements = $(this).text().split('');
        $(this).text('');
        var line = $('<span class=line>');
        $(this).append(line);
        for (var i = 0; i < elements.length; i++) {
            if (elements[i-1] === ' ' || i === 0){
                var word = $('<span class=word>');
                $(line).append(word);
            }
            if (elements[i] === ' '){
                $(line).append('<span class=space>' + elements[i] + '</span>');
            } 
            else{
            $(word).append('<span class=letter>' + elements[i] + '</span>');
            }
        }
    });

   $('.rhymeHighlight').on('click',function(){
      if (highlighting){
        $('.highlightColors').css('display', 'none');
          highlighting=false;
          $('.rhymeHighlight').text('Start Hightlighting');
      }
      else{
        $('.highlightColors').css('display', 'inline-block');
        highlighting=true;
        $('.rhymeHighlight').text('Stop Hightlighting');

       }
   });
   
   colors.forEach(function(c){
       var colorSquare=$('<div class="colorSquare"></div>');
       colorSquare.data('color', c);
       colorSquare.css('background-color', c);
       $('.highlightColors').append(colorSquare);
       
   })
    
    $('.colorSquare').on('click',function(){
        highlightColor=$(this).data('color');
        $('.colorSquare').each(function(){
            $(this).css('border-width', '0px');
        })
        $(this).css('border-width', '2px');

    });
    

    $('.poemLine').on('click', function(){
        if(highlighting){
            //console.log(this.firstElementChild);
            $(event.target).css('background-color',highlightColor);
        }
    })
    
    function addSyllable(range){
         /*var img = $('<img src=http://erickimphotography.com/blog/wp-content/uploads/2013/10/veritcal-line.jpg>');
         $(range.commonAncestorContainer.parentElement).append(img);
        img.attr('height', 20); 
        img.attr('width', 50);*/
        var verticalLine = $('<span class = syllableMarker> | </span>');
        verticalLine.css('font-weight', 'bold');
        verticalLine.css('color', 'red');
        verticalLine.css('font-size', '1.3em');
        $(range.commonAncestorContainer.parentElement).append(verticalLine);
    }
   
   $('.syllablesOption').on('click',function(){
       $('.poem').click(function (e) { //Default mouse Position 
           var sel = window.getSelection();
           console.log(sel);
           var range = sel.getRangeAt(0);
           console.log(range);
           addSyllable(range);
       });
   });
   
  });
 
