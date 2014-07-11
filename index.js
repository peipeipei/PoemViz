var colors=['#EE7575','#F373B9','#DE7DFF','#AD8BFE', "#7BA7E1",'#66EEEE','#4AE371', '#66FF22', '#FFFF44', '#FFAC62'];
var highlightColor='';
var highlighting=true;
var selectedLayer='';
var highlightElement='line';

$(document).ready(function(){
    //make each alphanumeric character/space/word/line a span with seperate class
    function makeSpans() {
        var count = 0;
        $('.poemLine').each(function(){
            var elements = $(this).text().split('');
            $(this).text('');
            var line = $('<span class="line col-md-11">');
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
                if (i == elements.length - 1){
                    //make linebreak space wide enough to prepend breaks to
                    //only works if no spaces at end of line already!
                    var linebreak = $('<span class=space> </span>');
                    linebreak.css('padding-left', '1px');
                    $(line).append(linebreak);
                 }
            }
            var lineCount = $('<span class=lineCount style="color:blue; font-weight:bold">');
            $(this).append(lineCount);
        });
        
    }
    
    makeSpans();
    
    function updateSpans() {
        $('.letter, .space').each(function(){
            if ($(this).text().length > 1){
            var elements = $(this).text().split(' ');
            console.log(elements);
            $(this).text('');
            var line = $(this).closest('.line');
            for (var i = 0; i < elements.length; i++) {
                if (i===0){
                      var letter = $(this).closest('.letter');
                      var elems = elements[i].split('');
                      for (var k = elems.length; k > 0 ; k--) {
                      letter.after('<span class=letter>' + elems[i] + '</span>');
                      }
                      word = $(this).closest('.word');
                      console.log(word);
                }
                else{
                if (false){
                }
                else{
                   word.after('<span class=space>'+ ' ' +'</span>');
                   newWord = $('<span class=word>');
                   $(word).first('.space').after(newWord);
                   word = newWord;
                   elems = elements[i].split('');
                   for (var j = 0; j < elems.length; j++) {
                       word.append('<span class=letter>' + elems[i] + '</span>');
                   }
                 }
              }
            }
            }
        })
    }
    
    function initialCount(){
        $('.poemLine').each(function(){
            var words = $(this).find('.word');
            var wordCount = words.length;
            var lineCount = $(this).children('.lineCount')[0]
            $(lineCount).text(wordCount);
        })
    }
    
    initialCount();

//   $('.rhymeHighlight').on('click',function(){
//       if (highlighting){
//         $('.highlightColors').css('display', 'none');
//           highlighting=false;
//           $('.rhymeHighlight').text('Start Highlighting');
//       }
//       else{
//         $('.highlightColors').css('display', 'inline-block');
//         highlighting=true;
//         $('.rhymeHighlight').text('Stop Highlighting');

//       }
//   });
   
   $('.layer').on('click',function(){
       var clickedLayer=this;
      $('.layer').each(function(){
          if(this == clickedLayer){
              $(this).css('opacity', 1.0);
               selectedLayer=$(this).data('name');
               console.log(selectedLayer);
          }else{
              $(this).css('opacity',0.5);
          }
      });
      if (selectedLayer=='syllable'){
          startSyllables();
      }else{
          stopSyllables();
      }
   });
   
/*   colors.forEach(function(c){
       var colorSquare=$('<div class="colorSquare"></div>');
       colorSquare.data('color', c);
       colorSquare.css('background-color', c);
       $('.highlightColors').append(colorSquare);
       
   })*/
   
    for (i=0;i<2;i++){
       var colorSquare=$('<div class="colorSquare"></div>');
       colorSquare.data('color', colors[i]);
       colorSquare.css('background-color', colors[i]);
       $('.highlightColors').append(colorSquare);
    }
    
    $('.colorSquare').on('click',chooseColor);
    
    $('.addColor').on('click',function(){
        var colorSquare=$('<div class="colorSquare"></div>');
        var ccount=$('.highlightColors').find('.colorSquare').length;
        colorSquare.data('color', colors[ccount]);
        colorSquare.css('background-color', colors[ccount]);
        $('.highlightColors').append(colorSquare);
        $('.colorSquare').on('click',chooseColor);
        if(ccount==colors.length-1){
            $('.addColor').css('display','none');
        }
    })
    
    //$('.colorSquare').on('click',
    function chooseColor(){
        highlightColor=$(this).data('color');
        $('.colorSquare').each(function(){
            $(this).css('border-width', '0px');
        })
        $(this).css('border-width', '2px');

    }
    

    $('.line').on('click', function(){
        if(selectedLayer=='rhyme' && highlightElement=='line'){
            $(this).css('background-color',highlightColor);
        }
    })
    
    $('.word').on('click', function(){
        if(selectedLayer=='rhyme' && highlightElement=='word'){
            $(this).css('background-color',highlightColor);
        }
    })
    
    
    $('#rhymeSelect').on('change',function(){
      highlightElement=$('#rhymeSelect').val();
    })
    
    function addSyllable(object, color, ifghost){
    if (ifghost){
        var verticalLine = $('<span class = ghostMarker>|</span>');
    }
    else{
        var verticalLine = $('<span class = syllableMarker>|</span>');}
    verticalLine.css('font-weight', 'bold');
    verticalLine.css('color', color);
    verticalLine.css('font-size', '1.3em');
    object.prepend(verticalLine);
}

function startSyllables(){
    $( ".letter, .space" )
         .mouseover(function() {
          //addSyllable($(this).prev(), 'lightgray', true);
          if ($(this).children('.syllableMarker').length === 0 && $(this).children('.ghostMarker').length === 0){
          addSyllable($(this), 'lightgray', true);
          }
         })
         .mouseout(function() {
         // $(this).prev().children('.ghostMarker').remove();
           $(this).children('.ghostMarker').remove();
         });
      
    $('.letter, .space').click(function (e) { //Default mouse Position
        //var sel = window.getSelection();
        //var range = sel.getRangeAt(0);
        //console.log(range.commonAncestorContainer.parentElement);
        var lineSpan = $(this).parent().parent().parent()[0];
        var countSpan = $(lineSpan).children('.lineCount')[0];
        var count = $(countSpan).text();
        if ($(this).attr('class') == 'syllableMarker'){
            $(this).remove();  
        }
        else{
            if ($(this).children('.syllableMarker').length > 0)
            {
                $(this).children('.syllableMarker').remove();
                count--;
                $(countSpan).text(count);
                
            }
            else{
               if ($(this).attr('class') == 'ghostMarker'){
                   $(this).remove();
               }
               if ($(this).children('.ghostMarker').length > 0)
               {
                $(this).children('.ghostMarker').remove(); 
               }
            addSyllable($(this), 'red', false);
            count++;
            $(countSpan).text(count);
            }
        }
     })
         $('.syllablesOption').data('active', true);
         $('.syllablesOption').text('Stop Syllables');
}
   
    $('.syllablesOption').on('click',function(){
        if($('.syllablesOption').data('active')===false){
            startSyllables();
        }else{
            stopSyllables();
        }
    });
    
    function stopSyllables(){
        $('.letter, .space').unbind('mouseover');
        $('.letter, .space').unbind('click');
        $('.syllablesOption').text('Start Syllables');
        $('.syllablesOption').data('active', false);
    }
    
  
    $('.syllablesCount').on('click', function(){
        console.log('click');
        $('.poemLine').each(function(){
            console.log($(this).find('.syllableMarker').length)
        })
        
    })  
   
   function throttle(f, delay){
    var timer = null;
    return function(){
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = window.setTimeout(function(){
            f.apply(context, args);
        },
        delay || 2000);
    };
    }
   
   //waits 5 sec after last key press to remake spans in time for 
   //possible highlighting or syllable work
   $('.poem').keyup(throttle(function() {
       updateSpans();
   }));
   
  });
 
