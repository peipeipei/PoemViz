var colors=['#f99','#F9F','#D9F','#A9F', "#9CF",'#9FF', '#9FA','#CF9', '#FF9', '#FC9'];
var darkColors=['#000','#063','#009','#506','#602'];
var highlightColor='';
var boldColor='';
var highlighting=true;
var selectedType='';
var selectedLayer='';
var highlightElement='line';
var boldElement='boldLine';
var counter = 1;
var sCounter=1;
var clickedLayer = $('#color0');
var target = $('.rhymeSelect');
var boldCounter = 1;
var boldColor = 'black';

$(document).ready(function(){
    //make each alphanumeric character/space/word/line a span with seperate class
    function makeSpans() {
        $('.poemLine').each(function(){
            var elements = $(this).text().split('');
            $(this).text('');
            var line = $('<span class="line col-md-11">');
            $(this).append(line);
            for (var i = 0; i < elements.length; i++) {
                if (elements[i-1] === ' ' || i === 0){
                    var syllable=$('<span class=syllable>')
                    var word = $('<span class=word>');
                    $(word).append(syllable);
                    $(line).append(word);
                }
                if (elements[i] === ' '){
                    $(line).append('<span class=space>' + elements[i] + '</span>');
                } 
                else{
                   $(syllable).append('<span class=letter>' + elements[i] + '</span>');
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
        
        $('.letter').on('click', function(){
        if(selectedType=='rhyme' && highlightElement=='letter'){
            var num = $(clickedLayer).attr('id').slice(-1);
            $(this).css('background-color',highlightColor);
            $(this).data('colorer'+num, []);
            $(this).data('colorer'+num).push(highlightColor);
            $(this).data('colorer'+num).push(true);
        }
        if(selectedType=='bold' && boldElement=='boldLetter'){
            var num = $(clickedLayer).attr('id').slice(-1);
            if(boldColor != 'transparent'){
                $(this).css('color',boldColor);
                $(this).css('font-weight','bold');
            }
            else{
                $(this).css('color','black');
                $(this).css('font-weight','normal');
            }
            $(this).data('bolder'+num, []);
            $(this).data('bolder'+num).push(boldColor);
            $(this).data('bolder'+num).push(true);
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
                    for (var ii = 0; ii < textArray.length ; ii++){
                        if (textArray[ii] === " "){
                            newText = newText + "<span class='space'>" + textArray[ii] + "</span>";
                        }
                        else{
                            newText = newText + "<span class='letter'>" + textArray[ii] + "</span>";
                        }
                    }
                    //$(this) = newText;
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

function generalSetup(){
   
   $('.layer').on('click',function(){
       clickedLayer=this;
      $('.layer').each(function(){
          if(this == clickedLayer){
              $(this).css('opacity', 1.0);
               selectedType=$(this).data('name');
               console.log(selectedType);
               selectedLayer=$(this).attr('id');
                highlightElement=$(clickedLayer).find('.rhymeSelect').val();
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
   
   $('.visibility').on('change',function(){
       console.log($(this).data('layer'));
        var idFull = $(this).closest('.layer');
        var id = idFull.attr('id').slice(-1);
        var visible=$(this).is(':checked');
        if($(this).data('layer')=='syllable'){
            if(visible){
                $('.syllable').css('border-color', '#eee');
                $('.syllable').css('min-width', '65px');
                $('.letter, .space').each(function(){
                if ($(this).data('syllable') == 'true'){
                    $(this).css('border-left', '3px solid red');
                }
                });
            }
            else{
                $('.syllable').css('border-color', 'white');
                $('.syllable').css('min-width', '0px');
                $('.letter, .space').each(function(){
                    $(this).css('border-left', 'none');
                });
            }
        }
        if($(this).data('layer')=='rhyme'){
            if (visible){
                $('.line, .word, .letter').each(function(){
                         if(typeof $(this).data('colorer'+id) === 'undefined'){}
                         else{
                         var whichColor = $(this).data('colorer'+id)[0];
                         $(this).removeData('colorer'+id);
                         $(this).data('colorer'+id, [])
                         $(this).data('colorer'+id).push(whichColor);
                         $(this).data('colorer'+id).push(true);
                         $(this).css('background-color', $(this).data('colorer'+id)[0]);
                         }
                });
            }else {
                    $('.line, .word, .letter').each(function(){
                        var flag = true;
                        if(typeof $(this).data('colorer'+id) === 'undefined'){}
                        else{
                        var whichColor = $(this).data('colorer'+id)[0];
                        $(this).removeData('colorer'+id);
                        $(this).data('colorer'+id, [])
                        $(this).data('colorer'+id).push(whichColor);
                        $(this).data('colorer'+id).push(false);}
                        console.log($(this).data('colorer'+id));
                        for (var i = 0; i < counter; i++){
                            if(typeof $(this).data('colorer'+i) !== 'undefined'){
                                if ($(this).data('colorer'+i)[1] === true && $(this).data('colorer'+i)[0] !== ""){
                                    $(this).css('background-color', $(this).data('colorer'+i)[0]);
                                    flag = false;
                                    break;
                                }
                            }
                        }
                        if (flag){
                             $(this).css('background-color', 'transparent');
                        }
                    });
                 }
                }
            if ($(this).data('layer') =='bold'){
                 if (visible){
                    $('.line, .word, .letter').each(function(){
                             if(typeof $(this).data('bolder'+id) === 'undefined'){}
                             else{
                             var whichColor = $(this).data('bolder'+id)[0];
                             if (whichColor != 'transparent' || whichColor != ""){
                                 $(this).removeData('bolder'+id);
                                 $(this).data('bolder'+id, [])
                                 $(this).data('bolder'+id).push(whichColor);
                                 $(this).data('bolder'+id).push(true);
                                 $(this).css("color", whichColor);
                                 $(this).css("font-weight", "bold");
                             }
                             }
                    });
                }else {
                        $('.line, .word, .letter').each(function(){
                             var bflag = true;
                             if(typeof $(this).data('bolder'+id) === 'undefined'){}
                             else{
                             var whichColor = $(this).data('bolder'+id)[0];
                             $(this).removeData('bolder'+id);
                             $(this).data('bolder'+id, [])
                             $(this).data('bolder'+id).push(whichColor);
                             $(this).data('bolder'+id).push(false);}
                             console.log($(this).data('bolder'+id));
                             for (var i = 0; i < counter; i++){
                                 if(typeof $(this).data('bolder'+i) !== 'undefined'){
                                     if ($(this).data('bolder'+i)[1] === true && $(this).data('bolder'+i)[0] !== ""){
                                          $(this).css('color', $(this).data('bolder'+i)[0]);
                                          $(this).css('font-weight', 'bold');
                                            bflag = false;
                                             break;}
                                 }
                                 }
                                 if (bflag){
                                     $(this).css('font-weight', 'normal');
                                     $(this).css('color', 'black');
                                 }
                        });
                     }
                    } 
                    

    });
}
   
 function colorSetup(id){  
    for (i=0;i<2;i++){
       var colorSquare=$('<div class="colorSquare"></div>');
       colorSquare.data('color', colors[i]);
       colorSquare.css('background-color', colors[i]);
       var highlight = $('#' +'color'+ id).find('.highlightColors');
      $(highlight).append(colorSquare);
    }
    
    $('.colorSquare').on('click',chooseColor);
    
   var addColor = $('#' +'color'+ id).find('.addColor');
    $(addColor).on('click',function(){
        var colorSquare=$('<div class="colorSquare"></div>');
        var rightlightColors=$($(this).parent()).find('.highlightColors');
        var ccount=rightlightColors.find('.colorSquare').length;
        colorSquare.data('color', colors[ccount]);
        colorSquare.css('background-color', colors[ccount]);
        rightlightColors.append(colorSquare);
        $('.colorSquare').on('click',chooseColor);
        if(ccount==colors.length-1){
            $(addColor).css('display','none');
        }
    })


    
    //('.colorSquare').on('click',
    function chooseColor(){
        highlightColor=$(this).data('color');
        $('.colorSquare').each(function(){
            $(this).css('border-width', '0px');
        })
        $(this).css('border-width', '2px');

    }
    

/*   $('.letter').on('click', function(){
        if(selectedType=='rhyme' && highlightElement=='letter'){
            var num = $(clickedLayer).attr('id').slice(-1);
            $(this).css('background-color',highlightColor);
            $(this).data('colorer'+num, []);
            $(this).data('colorer'+num).push(highlightColor);
            $(this).data('colorer'+num).push(true);
            console.log($(this).data('colorer'+num));
            console.log('colorer'+num);
        }
    })*/
    
    $('.rhymeSelect').on('change',function(){
      highlightElement=$(this).val();
    })
    
}

$('.line').on('click', function(){
    if(selectedType=='rhyme' && highlightElement=='line'){
        var num = $(clickedLayer).attr('id').slice(-1);
        if (typeof $(this).data('colorer'+num) === 'undefined'){
            $(this).css('background-color',highlightColor);
            $(this).data('colorer'+num, []);
            $(this).data('colorer'+num).push(highlightColor);
            $(this).data('colorer'+num).push(true);
        }else{
            $(this).removeData('colorer'+num);
            var flag=true;
            for (var i = 0; i < counter; i++){
                if(typeof $(this).data('colorer'+i) !== 'undefined'){
                    if ($(this).data('colorer'+i)[1] === true){
                        $(this).css('background-color', $(this).data('colorer'+i)[0]);
                        flag = false;
                        break;
                    }
                }
            }
            if (flag){
                 $(this).css('background-color', 'transparent');
            }
        }
    }
    if(selectedType=='bold' && boldElement=='boldLine'){
        var num = $(clickedLayer).attr('id').slice(-1);
        if(boldColor != 'transparent'){
            $(this).css('color',boldColor);
            $(this).css('font-weight','bold');
        }
        else{
            $(this).css('color','black');
            $(this).css('font-weight','normal');
        }
        $(this).data('bolder'+num, []);
        $(this).data('bolder'+num).push(boldColor);
        $(this).data('bolder'+num).push(true);
        console.log($(this).data('bolder'+num));
    }
})

$('.word').on('click', function(){
    if(selectedType=='rhyme' && highlightElement=='word'){
        var num = $(clickedLayer).attr('id').slice(-1);
        $(this).css('background-color',highlightColor);
        $(this).data('colorer'+num, [])
        $(this).data('colorer'+num).push(highlightColor);
        $(this).data('colorer'+num).push(true);
        console.log($(this).data('colorer'+num));
        console.log('colorer'+num);
    }
    if(selectedType=='bold' && boldElement=='boldWord'){
        var num = $(clickedLayer).attr('id').slice(-1);
        $(this).css('color',boldColor);
        if(boldColor != 'transparent'){
            $(this).css('color',boldColor);
            $(this).css('font-weight','bold');
        }
        else{
            $(this).css('color','black');
            $(this).css('font-weight','normal');
        }
        $(this).data('bolder'+num, [])
        $(this).data('bolder'+num).push(boldColor);
        $(this).data('bolder'+num).push(true);
        console.log($(this).data('bolder'+num));
    }
})

function boldSetup(id){  
    for (i=0;i<2;i++){
       var colorSquare=$('<div class="colorSquare"></div>');
       colorSquare.data('color', darkColors[i]);
       colorSquare.css('background-color', darkColors[i]);
       var highlight = $('#' +'bold'+ id).find('.boldColors');
      $(highlight).append(colorSquare);
    }
    
    $('.colorSquare').on('click',chooseBoldColor);
    
   var addColor = $('#' +'bold'+ id).find('.addColor');
    $(addColor).on('click',function(){
        var colorSquare=$('<div class="colorSquare"></div>');
        var rightlightColors=$($(this).parent()).find('.boldColors');
        var ccount=rightlightColors.find('.colorSquare').length-1;
        colorSquare.data('color', darkColors[ccount]);
        colorSquare.css('background-color', darkColors[ccount]);
        rightlightColors.append(colorSquare);
        $('.colorSquare').on('click',chooseBoldColor);
        if(ccount>=darkColors.length-1){
            $(addColor).css('display','none');
        }
    })


    
    //('.colorSquare').on('click',
    function chooseBoldColor(){
        boldColor=$(this).data('color');
        console.log('boldC' + boldColor)
        $('.colorSquare').each(function(){
            $(this).css('border-width', '0px');
        })
        $(this).css('border-width', '2px');
        $(this).css('border-color', 'white');

    }

    
    $('.boldSelect').on('change',function(){
      boldElement=$(this).val();
    })
    
}
     generalSetup();
     colorSetup('0');

    
  /*  function addSyllable(object, color, ifghost){
    if (ifghost){
        var verticalLine = $('<span class = ghostMarker>|</span>');
    }
    else{
        var verticalLine = $('<span class = syllableMarker>|</span>');}
    verticalLine.css('font-weight', 'bold');
    verticalLine.css('color', color);
    verticalLine.css('font-size', '1em');
    verticalLine.data('layer', selectedLayer);
    object.prepend(verticalLine);
}*/

function startSyllables(){
    $('.letter, .space').unbind('click');
    $( ".letter, .space" )
         .mouseover(function() {
           if ($(this).css('border-left-color') == 'rgb(255, 0, 0)'){}
           else{
           $(this).css('border-left', '3px solid gray');}
         })
         .mouseout(function() {
          if ($(this).css('border-left-color') =='rgb(255, 0, 0)'){}
          else{ 
          $(this).css('border-left', 'none');}
         });
      
    $('.letter, .space').click(function (e) { //Default mouse Position
        if ($(this).css('border-left-color') == 'rgb(255, 0, 0)'){
            $(this).css('border-left', 'none');
            $(this).data('syllable', 'false')
        }
        else{
            $(this).css('border-left', '3px solid red');
            $(this).data('syllable', 'true');
            /*var oldSyl=$(this).parent();
            var syLs=oldSyl.find('.letter');
            var clicked=this;
            var newSyl='<span class=syllable>';
            syLs.each(function(){
                if(clicked==this){
                    newSyl+='</span><span class=syllable><span class=letter>'+$(this).html()+'</span>';
                }else{
                    newSyl +='<span class=letter>'+$(this).html()+'</span>';
                }
            })
            newSyl+='</span>'
            $(oldSyl).replaceWith(newSyl);*/
        }
    })
}

$('.wordOption').on('click',function(){
        if($('.wordOption').data('active')){
            $('.poem').css('color', 'rgba(0,0,0,1)');
            $('.wordOption').text('Turn Text Off');
            $('.wordOption').data('active', false);
        }else{
            $('.poem').css('color', 'rgba(0,0,0,0)');
            $('.wordOption').text('Turn Text On');
            $('.wordOption').data('active', true);
        }
});
            
$('.puncOption').on('click',function(){
        if($('.puncOption').data('active')){
            //go back to original, use stored input data?
            $('.puncOption').text('Lines by Punctuation');
            $('.puncOption').data('active', false);
        }else{
            $('.puncOption').text('Lines by Linebreaks');
            $('.puncOption').data('active', true);
            var text = $('.poem').text().split(/[,.?!;:]|-\s/g);
            console.log(text);
            $('.poem .poemLine').remove();
            for (var t = 0; t < text.length; t++) {
                var line = $('<p class="poemLine">');
                var inside = $('<span class="line col-md-11">');
                $('.poem').append(line);
                $(line).append(inside);
                var elements = text[t];
                for (var i = 0; i < elements.length; i++) {
                if (elements[i-1] === ' ' || i === 0){
                    var syllable=$('<span class=syllable>')
                    var word = $('<span class=word>');
                    $(word).append(syllable);
                    $(inside).append(word);
                }
                if (elements[i] === ' '){
                    $(inside).append('<span class=space>' + elements[i] + '</span>');
                } 
                else{
                   $(syllable).append('<span class=letter>' + elements[i] + '</span>');
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
            $(inside).append(lineCount);
        }
        }
});

function syllableSetup() {   
  
    $('.syllablesCount').on('click', function(){
        console.log('click');
        $('.poemLine').each(function(){
            console.log($(this).find('.syllableMarker').length)
        });
        
    });  
    
    $('.syllablesGrid').on('click' , function(){
       /* if ($('.syllablesGrid').data('gridded')===false){
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
                    result += "<td><div style='width:60px'>"+gridArray[i][j]+"</div></td>";
                }
                result += "</tr>";
            }
            result += "</table>";
            
            var grid=$(result);
            $('.poem').hide();
            $('.left').append(grid);
            $('.syllablesGrid').data('gridded',true);
            $('.syllablesGrid').text('Ungrid');
        }else{
            $('.poem').show();
            $('#griddedSyllables').remove();
            $('.syllablesGrid').data('gridded',false);
            $('.syllablesGrid').text('Grid');
        }*/
        if ($('.syllablesGrid').data('gridded')===false){
        $('.syllable').css('display', 'inline-block');
        $('.syllable').css('border', '1px solid transparent');
        $('.syllable').css('min-width', '65px');
        $('.syllablesGrid').data('gridded',true);
        }
        else{
             $('.syllablesGrid').data('gridded',false);
             $('.syllable').css('display', 'inline');
             $('.syllable').css('border', 'none');
             $('.syllable').css('min-width', '0');
        }
        
    });
    
    $('.syllablesClear').on('click',function(){
        $('.letter, .space').each(function(){
           if ($(this).css('border-left-color') == 'black'){}
           else{
               if ($(this).css('border-left-color', 'red')){
                $(this).css('border-left', 'none');
                $(this).data('syllable', 'false');   
               }
           }
        });
       /* var visible=$(this).parent().parent().parent().find('.visibility').is(':checked');
       var markers=$('.syllableMarker');
       markers.each(function(){
            var lineSpan = $(this).parent().parent().parent().parent()[0];
            var countSpan = $(lineSpan).children('.lineCount')[0];
            var count = $(countSpan).text();
            if ($(this).data('layer')==selectedLayer){
                $(this).remove();
                if(visible){
                    count--;
                }
            }
            $(countSpan).text(count);
       });*/
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
      colorSetup(counter);
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
        $(".existingLayers").append("<div class='layer' data-name='syllable'  id='syllable"+sCounter+ "' "+" </div>"+
                    openDiv+ "</div>"+
                    "<div class='info'> Please show the syllable breaks WITHIN words, the ones between words have already been counted.</div>"+
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
    
    $('.newBoldLayer').on('click',function(){
        var name = $(this).text();
        if (name == "Other Bolding"){
            var openDiv = "<div contenteditable='true' class='layerName'>"+ "Click Here to Enter Layer Name" ;
        }
        else{
            var openDiv = "<div class='layerName'>"+ name ;
        }
        $(".existingLayers").append("<div class='layer' data-name='bold' id='bold"+boldCounter+ "' "+" </div>"+
                    openDiv + "</div>"+
                    "Bold:"+
                    "<select class='boldSelect'>"+
                        "<option value='boldLine'>Line</option>" +
                        "<option value='boldWord'>Word</option>"+
                        "<option value='boldLetter'>Letter</option>"+
                    "</select>"+
                    "<div class='bolding'>"+
                        "<span class='boldColors'>Erase:<div class='colorSquare eraseBold' data-color='transparent'></div> Colors:</span>"+
                        "<button class='addColor'>"+
                           "+" +
                       "</button>"+
                    "</div>"+
                    "<span class='visibilitySpan'>Visibility:<input type='checkbox' data-layer='bold' class='visibility' checked></span>" +
                "</div>");
      generalSetup();         
      boldSetup(boldCounter);
      boldCounter++;
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
       updateSpans2();
       //makeSpans();
   }));
   
    
    var newPoem = $("<div class='overlay close overlay-hugeinc'>");
    $(newPoem).append("<button type='button' class='overlay-close' id='overlay-closed'>Close</button>");
    $(newPoem).append("<span class='newPoem'>");
    $(newPoem).append("<textarea class='editPoem' id='editPoem'>");
    $(newPoem).append("</textarea></span></div>");
    // $('.line').each(function(){
    //     var lineText = $(this).text();
    //     $(newPoem).append('<p class="newLine col-md-11"><span>' + lineText + '</span></p>');
    // });
    // $(newPoem).append("</span></div>");
    
    
    
//        var filledSpan = $(newPoem).children('span');
//        $(filledSpan).each(function(){
//            console.log($(this).text());
//        });
    $('body').append($(newPoem));
    
    var copyingCount = 0;
    
    $('.copyPoem').on('click',function(){
        if( $('.overlay').hasClass('close') ) {
            $('.overlay').removeClass('close' );
            $('.overlay').addClass('open');
            
            if (copyingCount === 0){
                var obj = document.getElementById('editPoem');
                console.log(obj);
                $('.line').each(function(){
                    var lineText = $(this).text();
                    obj.value += lineText;
                    obj.value += "\r\n";
                });
            }
            copyingCount++;
        }
    });
    
    $('#overlay-closed').click(function(){
        if( $('.overlay').hasClass('open') ) {
            $('.overlay').removeClass('open');
            $('.overlay').addClass('close');
        }
    });
    
})