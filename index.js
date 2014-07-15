var colors=['#EE7575','#F373B9','#DE7DFF','#AD8BFE', "#7BA7E1",'#66EEEE','#4AE371', '#66FF22', '#FFFF44', '#FFAC62'];
var highlightColor='';
var highlighting=true;
var selectedType='';
var selectedLayer='';
var highlightElement='line';
var counter = 1;
var sCounter=1;

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
                   var linebreak = $('<span class=space > </span>');
                   linebreak.css('padding-left', '1px');
                   $(line).append(linebreak);
                }
           }
           var lineCount = $('<span class=lineCount style="color:blue; font-weight:bold">');
           $(this).append(lineCount);
       });
       
   }
   
   makeSpans();
   //attempt to only update edited text
  /* function updateSpans() {
       $('.letter, .space').each(function(){
           if ($(this).text().length > 1){
           var elements = $(this).text().split(' ');
           $(this).text('');
           var line = $(this).closest('.line');
           for (var i = 0; i < elements.length; i++) {
               if (($(this).hasClass('space')) && i == elements.length - 1){
                     console.log(elements);
                     var word = $(this).first('.word');
                     var elems = elements[i].split('');
                     console.log(elems);
                     for (var k = elems.length-1; k >= 0; k--) {
                     word.next('.word').prepend('<span class=letter>' + elems[k] + '</span>');
                     }
                     if (elems[0] !== " "){
                         word.next('.word').prepend('<span class=space>'+ ' ' +'</span>');
                     }
               }
               else{
               if (i===0 && ($(this).hasClass('letter'))){
                    var letter = $(this).closest('.letter');
                     var elems = elements[i].split('');
                     for (var k = elems.length - 1; k >= 0 ; k--) {
                     letter.after('<span class=letter>' + elems[k] + '</span>');
                     }
                     word = $(this).closest('.word');
               }
               else{
                  space = $('<span class=space>'+ ' ' +'</span>');
                  word = $(this).prev('.word');
                  word.after(space);}
                  word = $(this).prev('.word');
                  newWord = $('<span class=word>');
                  space.after(newWord);
                  word = newWord;
                  elems = elements[i].split('');
                  console.log(elems);
                  for (var j = 0; j < elems.length; j++) {
                      word.append('<span class=letter>' + elems[j] + '</span>');
                  
                }
             }
           }
           }
       })
   }*/
   
   function stopSyllables(){
       $('.letter, .space').unbind('mouseover');
       $('.letter, .space').unbind('click');
       $('.syllablesOption').text('Start Syllables');
       $('.syllablesOption').data('active', false);
       $('.letter').on('click', function(){
       console.log(this);
       if(selectedType=='rhyme' && highlightElement=='letter'){
           console.log('alskdfjasdklfj');
           $(this).css('background-color',highlightColor);
           $(this).data('rhyme-color', highlightColor);
       }
   });
   }
   
   // Second attempt to only make spans with updated text
   function updateSpans2(){
       $('.line').each(function(){
           $('span').each(function(){
               if ($(this).text().length > 1){
                   var text = $(this).text();
                   var textArray = text.split(" ");
                   var newText = "";
                   for (var ii = 0; ii < textArray.length ; ii--){
                       if (textArray[ii] === " "){
                           newText = newText + "<span class='space'>" + textArray[ii] + "</span>";
                       }
                       else{
                           newText = newText + "<span class='letter'>" + textArray[ii] + "</span>";
                       }
                   }
                   $(this) = newText;
               }
           })
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

function generalSetup(id){
  
  $('.layer').on('click',function(){
      var clickedLayer=this;
     $('.layer').each(function(){
         if(this == clickedLayer){
             $(this).css('opacity', 1.0);
              selectedType=$(this).data('name');
              selectedLayer=$(this).attr('id');
              
              console.log($(this).attr('id'));
         }else{
             $(this).css('opacity',0.5);
         }
     });
     if (selectedType=='syllable'){
         startSyllables();
     }else{
         stopSyllables();
     }
  });
  
  var visibility = $(this).find('.visibility');
  visibility.on('change',function(){
       var visible=$(this).is(':checked');
       if($(this).data('layer')=='syllable'){
           var markers=$('.syllableMarker');
           markers.each(function(){
               console.log('meow',$(this).data('layer'));
              if ($(this).data('layer')==selectedLayer){
                   if(visible){
                       $(this).show();
                   }else{
                      $(this).hide();
                   }
              }
           });
       }
       if($(this).data('layer')=='rhyme'){
           if (visible){
               $('.line').each(function(index, line){
                   $(line).css('background-color', $(line).data('rhyme-color'));
               });
               $('.word').each(function(index, word){
                   $(word).css('background-color', $(word).data('rhyme-color'));
               });
           }else{
                   $('.poem').find('span').each(function(){
                       var flag = true;
                       console.log($(this).data('colorer'+i));
                       $(this).data('colorer'+id, [$(this).data('colorer'+i)[0], false]);
                        for (var i = 0; i < counter; i++){
                            if ($(this).hasData('colorer'+i) ){
                                if ($(this).data('colorer'+i)[1] == true){
                                $(this).css('background-color', $(this).data('colorer'+i)[0]);
                                flag = false;
                                 break;}
                            }
                            }
                            if (flag){
                                $(this).css('background-color', 'transparent');
                            }
                   });
              
       }
               }
   });

}
  
/*   colors.forEach(function(c){
      var colorSquare=$('<div class="colorSquare"></div>');
      colorSquare.data('color', c);
      colorSquare.css('background-color', c);
      $('.highlightColors').append(colorSquare);
      
  })*/
  
  
function colorSetup(id){  
   for (i=0;i<2;i++){
      var colorSquare=$('<div class="colorSquare"></div>');
      colorSquare.data('color', colors[i]);
      colorSquare.css('background-color', colors[i]);
      var highlight = $('#' + id).find('.highlightColors');
      console.log(highlight);
      console.log($(highlight));
     $(highlight).append(colorSquare);
   }
   
   $('.colorSquare').on('click',chooseColor);
   
   var addColorButton = $('#' + id).find('.addColor');
   $(addColorButton).on('click',function(){
       var colorSquare=$('<div class="colorSquare"></div>');
       var rightlightColors=$($(this).parent()).find('.highlightColors');
       var ccount=rightlightColors.find('.colorSquare').length;
       colorSquare.data('color', colors[ccount]);
       colorSquare.css('background-color', colors[ccount]);
       rightlightColors.append(colorSquare);
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
   

   $('.letter').on('click', function(){
       console.log(this);
       if(selectedType=='rhyme' && highlightElement=='letter'){
           $(this).css('background-color',highlightColor);
           $(this).data('rhyme-color', highlightColor);
           $(this).data('colorer'+id, [highlightColor, true])
       }
   })

   $('.line').on('click', function(){
       if(selectedType=='rhyme' && highlightElement=='line'){
           $(this).css('background-color',highlightColor);
           $(this).data('rhyme-color', highlightColor);
           $(this).data('colorer'+id, [highlightColor, true])
       }
   })
   
   $('.word').on('click', function(){
       if(selectedType=='rhyme' && highlightElement=='word'){
           $(this).css('background-color',highlightColor);
           $(this).data('rhyme-color', highlightColor);
           $(this).data('colorer'+id, [highlightColor, true])
       }
   })
   
   
   
   $('.rhymeSelect').on('change',function(){
     highlightElement=$(this).val();
     console.log('kasjdfhadskf',highlightElement);
   })
   
    }
    generalSetup();
    colorSetup('color');

   
   function addSyllable(object, color, ifghost){
   if (ifghost){
       var verticalLine = $('<span class = ghostMarker>|</span>');
   }
   else{
       var verticalLine = $('<span class = syllableMarker>|</span>');}
   verticalLine.css('font-weight', 'bold');
   verticalLine.css('color', color);
   verticalLine.css('font-size', '1.3em');
   verticalLine.data('layer', selectedLayer);
   object.prepend(verticalLine);
}

function startSyllables(){
   $('.letter, .space').unbind('click');
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

function syllableSetup() {   
   
   $('.syllablesOption').on('click',function(){
       if($('.syllablesOption').data('active')===false){
           startSyllables();
       }else{
           stopSyllables();
       }
   });
   
   
 
   $('.syllablesCount').on('click', function(){
       console.log('click');
       $('.poemLine').each(function(){
           console.log($(this).find('.syllableMarker').length)
       });
       
   });  
   
   $('.syllablesGrid').on('click' , function(){
       if ($('.syllablesGrid').data('gridded')===false){
           var gridArray=[];
           $('.line').each(function(){
               var lineText=$(this).text().split('|').join(' ').split(' ');
               lineText.pop();
               gridArray.push(lineText);
           });
           
           console.log(gridArray);
           var result = "<table id='griddedSyllables' border=1>";
           for(var i=0; i<gridArray.length; i++) {
               result += "<tr>";
               for(var j=0; j<gridArray[i].length; j++){
                   result += "<td><div style='width:67px'>"+gridArray[i][j]+"</div></td>";
               }
               result += "</tr>";
           }
           result += "</table>";
           
           var grid=$(result);
           $('.poem').hide();
           $('#leftSide').append(grid);
           $('.syllablesGrid').data('gridded',true);
           $('.syllablesGrid').text('Ungrid');
       }else{
           $('.poem').show();
           $('#griddedSyllables').remove();
           $('.syllablesGrid').data('gridded',false);
           $('.syllablesGrid').text('Grid');
       }
   });
   
   $('.syllablesClear').on('click',function(){
      var markers=$('.syllableMarker');
      markers.each(function(){
          if ($(this).data('layer')==selectedLayer){
              $(this).remove();
          }
      });
  });
}

  
   
   


syllableSetup();   
   $('.newColorLayer').on('click', function(){
       var name = $(this).text();
       if (name == "Other Coloring"){
           var openDiv = "<div contenteditable='true' class='layerName'>"+ "Click Here to Enter Layer Name" ;
       }
       else{
           var openDiv = "<div class='layerName'>"+ name ;
       }
       $(".existingLayers").append("<div class='layer' data-name='rhyme' id='color"+counter+ "' "+" </div>"+
                   openDiv + "</div>"+
                   "Highlight:"+
                   "<select class='rhymeSelect'>"+
                       "<option value='line'>Line</option>" +
                       "<option value='word'>Word</option>"+
                       "<option value='letter'>Letter</option>"+
                   "</select>"+
                   "<div class='highlighting'>"+
                       "<span class='highlightColors'>Erase:<div class='colorSquare eraseHighlight' data-color='transparent'></div> Colors:</span>"+
                       "<button class='addColor'>"+
                          "+" +
                      "</button>"+
                   "</div>"+
                   "<span class='visibilitySpan'>Visibility:<input type='checkbox' data-layer='rhyme' class='visibility' checked></span>" +
               "</div>");
     syllableSetup(); 
     generalSetup();         
     colorSetup('color'+counter);
     counter++;
   });
   
   $('.newBarsLayer').on('click', function(){
       var name = $(this).text();
       console.log(name);
       if (name == "Other Vertical Bars"){
           var openDiv = "<div contenteditable='true' class='layerName'>"+ "Click Here to Enter Layer Name" ;
       }
       else{
           var openDiv = "<div class='layerName'>"+ name ;
       }
       $(".existingLayers").append("<div class='layer' data-name='syllable'  id='syllablesyllable"+sCounter+ "' "+" </div>"+
                   openDiv+"</div>"+
                   "<div class='info'> ONLY CLICK FOR SYLLABLE BREAKS INSIDE OF WORDS, SAVE YOURSELF SOME WORK</div>"+
                   "<span class='visibilitySpan'>Visibility: <input type='checkbox' data-layer='syllable' class='visibility' checked></span>"+
                   "<div class='btn-group' id='toggle'>"+
                       "<span><button type='button' class='btn btn-default syllablesClear'>Clear All Syllable Marks</button></span>"+
                       "<span><button type='button' class='btn btn-default syllablesGrid' data-gridded=false>Grid</button></span>"+
                   "</div>"+
               "</div>");
        
        generalSetup(); 
        syllableSetup();
        sCounter++;
   });
   
   
   
  
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
      updateSpans2();
      //makeSpans();
  }));
  
});