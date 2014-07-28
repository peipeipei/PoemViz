//default colors for highlighting (sound, words layers)
var colors=['rgba(255,153,153,1)','rgba(255,153,255,1)','rgba(221,153,255,1)','rgba(170,153,255,1)', "rgba(153,204,255,1)",'rgba(153,255,255,1)', 'rgba(153, 255, 170,1)','rgba(204,255,153,1)', 'rgba(255,255,153,1)', 'rgba(255,204,153,1)'];
//default colors for bolding (bolding layers)
var darkColors=['rgba(0,0,0,1)','rgba(0,102,51,1)','rgba(0,0,153,1)','rgba(85,0,102,1)','rgba(102,0,34,1)'];
//used to store the current poem
var curPoem=Session.get('currentPoem');
//defaults
Session.set('highlightElement','line');
Session.set('boldElement','boldLine');
//used to store the current style
var curStyle;
//used to store the current layer (the number of the layer ID)
var num;
//var layerSelector = new ReactiveDict;
//layerSelector.set("curlayer ", "color1");
//  selectLayer.set("curlayer", "color1");
//  $('body').html("The weather here is <span class='forecast'></span>!");
//  Deps.autorun(function () {
//      $('.selectLayer').text(forecasts.get('curLayer'));
//  });
//  

//METEOR SETUP
var poemsHandle = Meteor.subscribe('poems');
var layersHandle=Meteor.subscribe('layers');
var selectionsHandle=Meteor.subscribe('selections');
var stylesHandle=Meteor.subscribe('styles');
var syllablesHandle=Meteor.subscribe('syllableMarkers');
var linesHandle=Meteor.subscribe('lineCounts');

Handlebars.registerHelper("equals", function (a, b) {
  return (a == b);
});

//makes sure that all your collections are ready before loading the page
checkIsReady = function(){
    console.log('ready!');
  return poemsHandle.ready()&&layersHandle.ready()&&selectionsHandle.ready()&&stylesHandle.ready()&&syllablesHandle.ready()&&linesHandle.ready();
}

Template.poem.isReady=function(){
    return checkIsReady();
}

//returns all the layers in the database
Template.poem.layer=function(){
    return Layers.find({poem_id:Session.get('currentPoem')}).fetch();
}

//choose the color you want to highlight or bold with
function chooseColor(thing){
    console.log(thing);
//    console.log(Session.get('selectedType'));
    if(Session.get('selectedType')=='rhyme'){
        Session.set('highlightColor',$(thing).data('color'));
        console.log($(thing).data('color'));
        console.log(Session.get('highlightColor'))
        $('.colorSquare').each(function(){
            $(this).removeClass('selectedColorSquare');
        })
        $(thing).addClass('selectedColorSquare');
        curStyle=Styles.insert({poem_id: Session.get("currentPoem"), layer_id: Session.get('curLayer'), background_color: Session.get('highlightColor')});
    }
    if (Session.get('selectedType')=='bold'){
        Session.set('boldColor',$(thing).data('color'));
        $('.colorSquare').each(function(){
        $(this).removeClass('selectedColorSquare');
    })
    $(thing).addClass('selectedColorSquare');
    curStyle = Styles.insert({poem_id: Session.get("currentPoem"), layer_id: Session.get('curLayer'), font_color: Session.get('boldColor'), bold: true});
    }
}

//how highlighting is stored/removed from Selections Collection
function colorClick(thing){
    num = Session.get('curLayer').slice(-1);
    var flag = true;
    var possibleSelections = Selections.find({poem_id: curPoem, location: $(thing).attr('id')}).fetch();
    _.each(possibleSelections, function(sel){
        var stylePosID = sel.style_id;
        var stylePos = Styles.findOne({_id:stylePosID});
        if (stylePos !== undefined){
        if (stylePos.background_color !== undefined && stylePos.layer_id == Session.get('curLayer')){
            flag = false;
        }
        }
    });
    if (flag){
        Selections.insert({poem_id: curPoem, style_id: curStyle, location: $(thing).attr('id')});
        var op = $('.opacity:checked').data("value");
        var opStyle = Styles.insert({poem_id: curPoem, layer_id: Session.get('curLayer'), opacity: op});
        Selections.insert({poem_id: curPoem, style_id: opStyle, location: Session.get('curLayer').slice(-1)});
    }else{
       var idR = Selections.find({poem_id: curPoem, location: $(thing).attr('id')}).fetch();
        var target = "";
        _.each(idR, function(sel){
            console.log(sel);
            var styleR = sel.style_id;
            var stylethis = Styles.findOne({_id: styleR});
            if (stylethis !== undefined){
            if (stylethis.layer_id == Session.get('curLayer')){
                target = sel;
            }
            }
        })
//        console.log('remove', target._id)
        Selections.remove(target._id);
    }
}

//how bolding is stored/removed from Selections Collection
function boldClick(thing){
    num = Session.get('curLayer').slice(-1);
    console.log('hi');
    var flag = true;
    var possibleSelections = Selections.find({poem_id: curPoem, location: $(thing).attr('id')}).fetch();
    _.each(possibleSelections, function(sel){
        var stylePosID = sel.style_id;
        var stylePos = Styles.findOne({_id:stylePosID});
        if (stylePos !== undefined){
        if (stylePos.font_color !== undefined && stylePos.layer_id == Session.get('curLayer')){
            flag = false;
        }
        }
    });
    if (flag){
        Selections.insert({poem_id: curPoem, style_id: curStyle, location: $(thing).attr('id')});
    }else{
       var idR = Selections.find({poem_id: curPoem, location: $(thing).attr('id')}).fetch();
        var target = "";
        _.each(idR, function(sel){
            var styleR = sel.style_id;
            var stylethis = Styles.findOne({_id: styleR});
            if (stylethis !== undefined){
            if (stylethis.layer_id == Session.get('curLayer')){
                target = sel;
            }
            }
        })
        Selections.remove(target._id);
    }

}

//how stressing is stored/removed from Selections Collection
function stressClick(thing){
    var selStyle=Layers.findOne({id:Session.get('curLayer'), poem_id:Session.get('currentPoem')}).style;
    if ($(thing).hasClass('stressStyle')){
        var idR = Selections.find({poem_id: curPoem, style_id: selStyle, location: $(thing).attr('id')}).fetch();
        var idRemove = idR[0]._id;
        Selections.remove(idRemove);   
    }else{
        Selections.insert({poem_id: curPoem, style_id: selStyle, location: $(thing).attr('id')});
    }
}

Deps.autorun(function () {
        var clickedLayerID = Session.get('curLayer');
        var clickedLayer = $('#' + clickedLayerID);
        $('.layer').each(function(){
            var thisID = $(this).attr('id')
            if(thisID == clickedLayerID){
                $(this).css('background-color', 'lightblue');
                Session.set('selectedType',$(this).data('name'));
            }
            else{
               $(this).css('background-color', '#dddddd'); 
            }
        });
        if (Session.get('selectedType')=='bold'){
            var colorSquares=$(clickedLayer).find('.colorSquare');
            var noneColored=true;
            //set default color if necessary (on the re-selection of layer)
            colorSquares.each(function(){
                if($(this).hasClass('selectedColorSquare')){
                    noneColored=false;
                }
            })
            if (noneColored){
              chooseColor(colorSquares[0]);  
            }
            //Session.set('boldElement', $(clickedLayer).find('.boldSelect').val());
            //curStyle=Styles.insert({poem_id: Session.get("currentPoem"), layer_id: Session.get('curLayer'), font_color: Session.get('boldColor'), bold: true});
        }
        else if (Session.get('selectedType')=='rhyme'){
            var colorSquares=$(clickedLayer).find('.colorSquare');
            var noneColored=true;
            //set default color if necessary (on the re-selection of layer)
            colorSquares.each(function(){
              console.log($(this).hasClass('selectedColorSquare'));
               if($(this).hasClass('selectedColorSquare')){
                    noneColored=false;
                } 
            })
            if (noneColored){
              chooseColor(colorSquares[0]);  
            }
            console.log(noneColored+"is the value of noneColored");
            //Session.set('highlightElement', $(clickedLayer).find('.rhymeSelect').val());
            //curStyle=Styles.insert({poem_id: Session.get("currentPoem"), layer_id: Session.get('curLayer'), background_color: Session.get('highlightColor')});
        }
        else if (Session.get('selectedType')=='stressing'){
            Session.set('stressElement', $(clickedLayer).find('.stressSelect').val());
        }
        //$(event.target).next().click();
});

//contains all the events that happen on the poem page
Template.poem.events({
    'click .layer': function(event){
//        selectLayer(event.currentTarget);
//        console.log(event.currentTarget);
        console.log($(event.currentTarget).attr('id'));
        Session.set("curLayer", $(event.currentTarget).attr('id'));
    },
    //whenever you click a layer, it visibly registers (clicked layer is full opacity), and selectedType and curLayer are set
//       'click .layer': function(event){
//        var clickedLayer=event.currentTarget;
//        $('.layer').each(function(){
//            if(this == clickedLayer){
//                $(this).css('background-color', 'lightblue');
//                Session.set('selectedType',$(this).data('name'));
//                Session.set('curLayer', $(clickedLayer).attr('id'));
//            }
//            else{
//               $(this).css('background-color', '#dddddd'); 
//            }
//        });
//        if (Session.get('selectedType')=='bold'){
//            var colorSquares=$(clickedLayer).find('.colorSquare');
//            var noneColored=true;
//            //set default color if necessary (on the re-selection of layer)
//            colorSquares.each(function(){
//                if($(this).css('border-width')==='2px'){
//                    noneColored=false;
//                }
//            })
//            if (noneColored){
//              chooseColor(colorSquares[0]);  
//            }
//            Session.set('boldElement', $(clickedLayer).find('.boldSelect').val());
//            curStyle=Styles.insert({poem_id: Session.get("currentPoem"), layer_id: Session.get('curLayer'), font_color: Session.get('boldColor'), bold: true});
//        }
//        else if (Session.get('selectedType')=='rhyme'){
//            var colorSquares=$(clickedLayer).find('.colorSquare');
//            var noneColored=true;
//            //set default color if necessary (on the re-selection of layer)
//            colorSquares.each(function(){
//               if($(this).css('border-width') ==='2px'){
//                    noneColored=false;
//                } 
//            })
//            if (noneColored){
//              chooseColor(colorSquares[0]);  
//            }
//            Session.set('highlightElement', $(clickedLayer).find('.rhymeSelect').val());
//            curStyle=Styles.insert({poem_id: Session.get("currentPoem"), layer_id: Session.get('curLayer'), background_color: Session.get('highlightColor')});
//        }
//        else if (Session.get('selectedType')=='stressing'){
//            Session.set('stressElement', $(clickedLayer).find('.stressSelect').val());
//        }
//        //$(event.target).next().click();
//        
//    },
    //stores name of custom layer
    //updates the layer database with the new name after user stops typing
    'keyup .layerName':function(event){
        var newName=$(event.currentTarget).text();
        var layerID=$(event.currentTarget).parent().attr('id');
        var curL_id=Layers.findOne({id:layerID})._id;
        typewatch(function () {
            Layers.update(curL_id, {$set: {name: newName}});
        }, 500);
    },
    //adds a highlight color to the available colors
    'click .addColor': function(event){
        var colorSquare=$('<span class="colorSquare"></span>');
        var rightlightColors=$($(event.target).parent()).find('.highlightColors');
        var ccount=rightlightColors.find('.colorSquare').length;
        colorSquare.data('color', colors[ccount]);
        colorSquare.css('background-color', colors[ccount]);
        var a = $('<div class="colorBlock">').append(colorSquare);
        var b = a.append($('<span class="colorName" contenteditable=true >Color Label</span></div>'));
        rightlightColors.append(b);
        // rightlightColors.append(colorSquare);
        if(ccount>=colors.length-1){
            $(event.target).css('display','none');
        }
    },
    //updates highlighting/bolding color when user clicks a square
    'click .colorSquare':function(event){
        console.log(event.currentTarget);
        chooseColor(event.currentTarget);
        console.log("hi");
    },
    //same as addColor, but for the bold layer
    'click .addBoldColor': function(event){
        var colorSquare=$('<div class="colorSquare"></div>');
        var rightlightColors=$($(event.target).parent()).find('.boldColors');
        var ccount=rightlightColors.find('.colorSquare').length;
        colorSquare.data('color', darkColors[ccount]);
        colorSquare.css('background-color', darkColors[ccount]);
        rightlightColors.append(colorSquare);
        $('.colorSquare').on('click',chooseColor);
        if(ccount>=darkColors.length-1){
            $(event.target).css('display','none');
        }
    },
    //when you change the dropdown menu in a color layer, it updates highlightElement
    'change .rhymeSelect':function(event){
        Session.set('highlightElement',$(event.currentTarget).val());
    },
    //same as rhymeSelect, but for bold
    'change .boldSelect':function(event){
        Session.set('boldElement',$(event.currentTarget).val());
    },
    //same as stressSelect, but for bold
    'change .stressSelect':function(event){
        Session.set('stressElement',$(event.currentTarget).val());
    },
    //clears all syllable marks
    'click .syllablesClear': function(event){
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
               SyllableMarkers.remove(idR[i]._id);}
        },
    //when user clicks a line and the line mode of highlighting or bolding is selected 
    'click .line':function(event){
        if(Session.get('selectedType')=='rhyme' && Session.get('highlightElement')=='line'){
            colorClick(event.currentTarget);
          }
          if(Session.get('selectedType')=='bold' && Session.get('boldElement')=='boldLine'){
            boldClick(event.currentTarget);
        }
    },
      //when user clicks an opacity option, change the opacity of all lines/words/characters colored/bolded by certain layer
      'change .opacity': function(event){
        var op = $(event.currentTarget).data("value");
        console.log(op);
        curStyle = Styles.insert({poem_id: curPoem, layer_id: Session.get('curLayer'), opacity: op});
        Selections.insert({poem_id: curPoem, style_id: curStyle, location: Session.get('curLayer').slice(-1)});
      },
      
      //allows user to hide/show the syllable marks or stressing
      'change .visibility': function(event){
        var idFull = this._id;
        var visible=$(event.currentTarget).is(':checked');
        if($(event.currentTarget).data('layer') =='syllable'){
            if(visible){
                $('.syllable').css('min-width', '65px');
                $('.letter, .space').each(function(){
                    console.log('hi');
                //must make sure we give this data attribute to other users
                if ($(this).hasClass('syllableStyle')){
                    console.log('syllable');
                    $(this).css('border-left', '3px solid red');
                }
                });
                $('.lineCount').css('opacity','1.0');
            }
            else{
                $('.syllable').css('min-width', '0px');
                $('.letter, .space').each(function(){
                    $(this).css('border-left', 'none');
                });
                $('.lineCount').css('opacity','0.0');
            }
        }
        if($(event.currentTarget).data('layer') =='stressing'){
            if(visible){
                $('.letter, .word').each(function(){
                //must make sure we give this data attribute to other users
                if ($(this).hasClass('stressStyle') === true){
                    $(this).css('vertical-align', 'super');
                }
                });
            }
            else{
                $('.letter, .word').each(function(){
                    $(this).css('vertical-align', 'baseline');
                });
            }
        }
    },
    
    //when user clicks a word and the word mode of highlighting or bolding is selected 
    'click .word':function(event){
        if(Session.get('selectedType')=='rhyme' && Session.get('highlightElement')=='word'){
            colorClick(event.currentTarget);
        }
        if(Session.get('selectedType')=='bold' && Session.get('boldElement')=='boldWord'){
            boldClick(event.currentTarget);
        }
       /* if (Session.get('selectedType')=='stressing' && Session.get('stressElement')=='stressWord'){
            stressClick(event.currentTarget);
        }*/
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
    
    //when user clicks a letter/space (character) and the "letter" mode of highlighting or bolding is selected 
    'click .letter, .space':function(event){
        if (Session.get('selectedType')=='syllable'){
            clickSyllable(event.currentTarget);
        }
        if(Session.get('selectedType')=='rhyme' && Session.get('highlightElement')=='letter'){
            colorClick(event.currentTarget);
          }
          if(Session.get('selectedType')=='bold' && Session.get('boldElement')=='boldLetter'){
            boldClick(event.currentTarget);
        }
        /*if (Session.get('selectedType')=='stressing' && Session.get('stressElement')=='stressLetter'){
            stressClick(event.currentTarget);
        }*/
        if (Session.get('selectedType')=='stressing'){
            stressClick(event.currentTarget);
        }
    },
    
    //clicking "grid" button in syllable layer
    'click .syllablesGrid': function(event){
        grid();
    },
    
    //scroll bar function
    'click .layers-menu':function(event){
        $(".right").animate({ scrollTop: $(document).height() }, "slow");
    },
    
    //create new layer that allows highlighting
    'click .newColorLayer':function(event){
        var name = $(event.currentTarget).text();
        var count=Layers.find({poem_id: curPoem, type:'rhyme'}).fetch().length;
//        console.log(count);
        if (name == "Other Coloring"){
            name='Click to name this layer!';
        }
        var divLayerID = 'color' + count;
       var layerID = Layers.insert({
          name:name,
          id:divLayerID,
          poem_id:Session.get('currentPoem'),
          type:'rhyme',
      })
       Session.set("curLayer", divLayerID);
//       selectLayer('#' +divLayerID);
//       console.log(divLayerID);
////        console.log($('#' + divLayerID).click());
//        Session.set('curLayer', divLayerID);
//        $('#' + divLayerID).click();
       
    },
    
    //create new layer that allows bolding
    'click .newBoldLayer':function(event){
        var name = $(event.currentTarget).text();
        var count=Layers.find({poem_id: curPoem, type:'bold'}).fetch().length;
        console.log(count);
        if (name == "Other Bolding"){
            name='Click to name this layer!';
        }
        var divLayerID = 'bold' + count;
        Layers.insert({
          name:name,
          id:divLayerID,
          poem_id:Session.get('currentPoem'),
          type:'bold',
      })
        Session.set("curLayer", divLayerID);
        
        
    },
    
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
            location.reload();
 }} });

//grid putting syllables in columns of equal width
function grid(){
    if ($('.syllablesGrid').data('gridded')===false){
        $('.syllable').each(function(){
            var letters=$(this).find('.letter');
            var intervals=[];
            letters.each(function(){
                if ($(this).hasClass('syllableStyle')){
                    intervals.push(parseInt($(this).attr('id').slice(4),10));
                }
            })
            if (intervals[0] != $(letters[0]).attr('id')){
                intervals.unshift(parseInt($(letters[0]).attr('id').slice(4),10));
            }
            var last=(parseInt($(letters[letters.length-1]).attr('id').slice(4),10)+1)
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
        $('.syllable').css('display', 'inline');
        $('.syllable').css('min-width', '0');
        $('.syllablesGrid').data('gridded',false);
    }
}

    //must update syllableMarkers
    function ghostMarker(thing) {
           if ($(thing).css('border-left-color') == 'rgb(255, 0, 0)'){}
           else{
           $(thing).css('border-left', '2px solid gray');} 
    }
    //must update syllableMarkers
    function noghostMarker(thing) {
           if ($(thing).css('border-left-color') =='rgb(255, 0, 0)'){}
          else{ 
          $(thing).css('border-left', 'none');} 
    }
    
    //must update syllableMarkers
    function clickSyllable(thing) {
        /*var lineSpan = $(thing).closest('.poemLine');
        var countSpan = $(lineSpan).find('.lineCount');
        var wordCount=$(lineSpan).find('.word').length;*/
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
        /*var sylCount=0;
        $(lineSpan).find('.letter').each(function(){
            if ($(this).hasClass('syllableStyle')===true){
                sylCount++; 
            }
        })
        $(countSpan).text(wordCount+sylCount);*/
        
    }  
    
    //stop reacting to syllable events when user selects other layer (that isn't syllable)
    function stopSyllables(){
        $('.poem').off("mouseover", ".letter, .space", ghostMarker);
        $('.poem').off("mouseout", ".letter, .space", noghostMarker);
        $('.poem').off("click", ".letter, .space", clickSyllable);
    }
    
    ///////////////////////////
    // Once the poem is rendered, run a query for all selections
    // When a selection is added, update the HTML of the poem using
    // the identifiers you gave it for every line, word, etc.
    ///////////////////////////
     Template.poem.rendered=function(){
         displaySelections();
     }
     
     //what to do upon rendering of poem
    function displaySelections(){
        //defaults
        Session.set('highlightElement','line');
        Session.set('boldElement','boldLine');
       curPoem = Session.get("currentPoem");
        var selectionsCursor = Selections.find({poem_id:Session.get('currentPoem')});
        selectionsCursor.observe({
          //when something is added to the Selections Collection
          added: function (selection, beforeIndex) {
            var location = selection.location;
            var styleID = selection.style_id;
            var style = Styles.find({_id:styleID}).fetch();
            //used to catch errors
            if (style.length > 0){
            var layerNodeID = style[0].layer_id;
            var layerID = Layers.findOne({poem_id: curPoem, id: layerNodeID})._id;
            //if selection is from highlighting style/layer
            if ((style[0].background_color !== null)&&(typeof style[0].background_color !== "undefined")) {
               var substring = style[0].background_color;
               $("#"+location).css(
                {
                    "background-color": substring
                }
               );
            }
            //if selection is from bolding style/layer
            if ((style[0].font_color !== null)&&(typeof style[0].font_color !== "undefined")) {
                var substring = style[0].font_color;
                $("#"+location).css(
                 {
                    "color": substring
                 }
                );
            }
            //if selection is from bolding style/layer
            if ((style[0].bold !== null)&&(typeof style[0].bold !== "undefined")) {
                var substring = style[0].bold;
                if (substring){
                $("#"+location).css(
                 {
                    "font-weight": "bold"
                 }
                );
                }
            }
            //if selection is from changing opacity
            if ((style[0].opacity !== null)&&(typeof style[0].opacity !== "undefined")) {
                //must change opacity of ALL selections colored by layer
                var allColorStylesofLayer = Styles.find({poem_id: curPoem, layer_id: "color"+location}).fetch();
                var allSelections = [];
                _.each(allColorStylesofLayer, function(allColor){
                    var piece = Selections.find({style_id: allColor._id}).fetch();
                    allSelections = allSelections.concat(piece);
                })
                _.each(allSelections, function(sel){
                    var thisID = sel.location;
                    var thisStyleID = sel.style_id;
                    var thisStyle = Styles.findOne({_id: thisStyleID});
                    if (thisStyle.background_color !== undefined){
                    //opacity of background color is changed by setting a part of rgba 
                    var rgba = thisStyle.background_color;
                    var lastIndex = rgba.lastIndexOf(",");
                    var substring = rgba.substr(0, lastIndex+1);
                    $("#"+thisID).css( 
                    {
                      "background": substring+style[0].opacity+")"
                    }
                    );
                    }
                    })
               }
            //if selection is from stressing style/layer
            if((style[0].verticalAlign !== null)&&(typeof style[0].verticalAlign !== "undefined")){
               /* var syllableArray = [];
                console.log((location));
                var firstLetter = $("#"+location).prev('.syllableStyle');
                //$("#"+location).closest('.word').children('.letter').first();
                var lastLetter = $("#"+location).next('.syllableStyle');
                //$("#"+location).closest('.word').children('.letter').last();
                var aLetter = firstLetter;
                console.log(firstLetter.attr('id'));
                console.log(lastLetter.attr('id'));
                while (aLetter.attr('id') !== lastLetter.attr('id')){
                    aLetter.addClass('stressStyle');
                    aLetter = aLetter.next('.letter');
                }*/
               // $("#"+location).addClass('stressStyle');
            }
            }
          },
          //when something is removed from the Selections Collection
            removed: function (selection, beforeIndex) {
            var location = selection.location;
            var styleID = selection.style_id;
            var style = Styles.find({_id:styleID}).fetch();
            //used to catch errors
            if (style.length > 0){
           //if removed is highlighting
            if ((style[0].background_color !== undefined)) {
                //must go through all selections that may have colored line/word/character to check and
                //see if after one background-color is turned off, there is another (from another layer)
                //still coloring that line/word/character
                var substring = "transparent";
                var allSelections = Selections.find({poem_id: curPoem, location: location}).fetch();
                _.each(allSelections, function(sel){
                  var piece = sel.style_id;  
                  var otherStyle = Styles.findOne({_id: piece});
                   if ((otherStyle !== undefined)){
                       substring = otherStyle.background_color;
                   }
                });
               $("#"+location).css(
                {
                    "background-color": substring
                }
               );
            }
            //if removed is bolding
            if ((style[0].font_color !== null)&&(typeof style[0].font_color !== "undefined")) {
                $("#"+location).css(
                {
                    "color": "black"
                }
               );
            }
            //if removed is bolding
            if ((style[0].bold !== null)&&(typeof style[0].bold !== "undefined")) {
                $("#"+location).css(
                {
                    "font-weight": "normal"
                }
               );
            }
            //if removed is stressing
            if((style[0].verticalAlign !== null)&&(typeof style[0].verticalAlign !== "undefined")){
                var substring = 'baseline';
                $("#"+location).removeClass('stressStyle');
            }

          }
        }
        });
            //handles additions/removals from SyllableMarkers Collection
            var syllablesCursor = SyllableMarkers.find({poem_id:Session.get('currentPoem')});
            syllablesCursor.observe({
            added: function (selection, beforeIndex) {
            var location = selection.location;
            $('#'+location).addClass("syllableStyle");
            var lineSpan = $('#'+location).closest('.poemLine');
            var countSpan = $(lineSpan).find('.lineCount');
            var wordCount=$(lineSpan).find('.word').length;
            var sylCount=0;
            $(lineSpan).find('.letter').each(function(){
            if ($(this).hasClass('syllableStyle')===true){
                sylCount++; 
            }
            })
             $(countSpan).text(wordCount+sylCount);
            },
            removed: function (selection, beforeIndex) {
            var location = selection.location;
            $('#'+location).removeClass("syllableStyle");
            var lineSpan = $('#'+location).closest('.poemLine');
            var countSpan = $(lineSpan).find('.lineCount');
            var wordCount=$(lineSpan).find('.word').length;
            var sylCount=0;
            $(lineSpan).find('.letter').each(function(){
            if ($(this).hasClass('syllableStyle')===true){
                sylCount++; 
            }
            })
             $(countSpan).text(wordCount+sylCount);
            },
          });
        };