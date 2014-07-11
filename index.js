var colors=['Yellow', 'LightBlue', 'LightPink', 'LightGreen', 'Plum', 'LightSalmon'];
var highlightColor='';
var highlighting=true;
var selectedLayer='';
var highlightElement='line';

$(document).ready(function(){
    
    //make each alphanumeric character/space/word/line a span with seperate class
    function makeSpans() {
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
            var lineCount = $('<span class=lineCount style="color:blue; font-weight:bold">');
            $(this).append(lineCount);
        });
    }
    
    makeSpans();
    
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
    
    $('.colorSquare').on('click',function(){
        highlightColor=$(this).data('color');
        $('.colorSquare').each(function(){
            $(this).css('border-width', '0px');
        })
        $(this).css('border-width', '2px');

    });
    

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
    
    function addSyllable(range){
        var verticalLine = $('<span class = syllableMarker>|</span>');
        verticalLine.css('font-weight', 'bold');
        verticalLine.css('color', 'red');
        verticalLine.css('font-size', '1.3em');
        var countSpan = $(range.commonAncestorContainer.parentElement).parent().parent().parent().children('.lineCount')[0];
        var count = $(countSpan).text();
        count++;
        $(countSpan).text(count);
        $(range.commonAncestorContainer.parentElement).append(verticalLine);
    }
   
    $('.syllablesOption').on('click',function(){
        $('.poem').click(function (e) { //Default mouse Position
            var sel = window.getSelection();
            var range = sel.getRangeAt(0);
    
            addSyllable(range);
        });
    });
  
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
        delay || 5000);
    };
    }
   
   //waits 5 sec after last key press to remake spans in time for 
   //possible highlighting or syllable work
   $('.poem').keyup(throttle(function() {
       makeSpans();
   }));
   
  });
 
