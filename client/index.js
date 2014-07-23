var colors=['#f99','#F9F','#D9F','#A9F', "#9CF",'#9FF', '#9FA','#CF9', '#FF9', '#FC9'];
var darkColors=['#000','#063','#009','#506','#602'];
var highlighting=true;
Session.set('highlightElement','line');
Session.set('boldElement', 'boldLine');
var counter = 1;
var sCounter=1;
var target = $('.rhymeSelect');
var boldCounter = 1;
var lineCounter = 0;
var wordCounter = 0;
var letterCounter = 0;
var spaceCounter = 0;
var styleCounter = 0;
var selCounter = 0;
var curPoem=Session.get('currentPoem');
var curStyle;
var num;
var curColor;

var poemsHandle = Meteor.subscribe('poems');
var layersHandle=Meteor.subscribe('layers');
var selectionsHandle=Meteor.subscribe('selections');
var stylesHandle=Meteor.subscribe('styles');
var syllablesHandle=Meteor.subscribe('syllableMarkers');

Handlebars.registerHelper("equals", function (a, b) {
  return (a == b);
});

checkIsReady = function(){
    console.log('ready!');
  return poemsHandle.ready()&&layersHandle.ready()&&selectionsHandle.ready()&&stylesHandle.ready()&&syllablesHandle.ready();
}

Template.poem.isReady=function(){
    return checkIsReady();
}


Template.poem.layer=function(){
    return Layers.find({poem_id:Session.get('currentPoem')}).fetch();
}

/*Template.poem.pLine=function(){
    var p = Poems.findOne().poemLines;
    var pp = [];
    p.forEach(function(pl){
        pp.push({text:pl, index: lineCounter});
        lineCounter++;
    })
    return pp;
}

Template.poem.word=function(){
    var elements=this.text.split(' ');
    var w=[];
    elements.forEach(function(v){
        w.push({text:v, index: wordCounter});
        wordCounter++;
    })
    return w;
}

Template.poem.letter=function(){
    var elements=this.text.split('');
    var l=[];
    elements.forEach(function(v){
        l.push({text:v, index: letterCounter});
        letterCounter++;
    })
    return l;
}

Template.poem.space=function(){
    var elements=this.text.split(' ');
    var s=[];
    for (var i=0; i < elements.length - 1; i++ ){
        s.push({text:" ", index: spaceCounter});
        spaceCounter++;
    }
    return s;
}*/

var typewatch = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  }  
})();

function chooseColor(thing){
    if(Session.get('selectedType')=='rhyme'){
        Session.set('highlightColor',$(thing).data('color'));
        curColor = $(thing).data('color');
        console.log($(thing).data('color'));
        $('.colorSquare').each(function(){
            $(this).css('border-width', '0px');
        })
        $(thing).css('border-width', '2px');
        curStyle=Styles.insert({poem_id: Session.get("currentPoem"), layer_id: Session.get('curLayer'), background_color: Session.get('highlightColor')});
    }
    if (Session.get('selectedType')=='bold'){
        Session.set('boldColor',$(thing).data('color'));
        $('.colorSquare').each(function(){
        $(this).css('border-width', '0px');
    })
    $(thing).css('border-width', '2px');
    curStyle = Styles.insert({poem_id: Session.get("currentPoem"), layer_id: Session.get('curLayer'), font_color: Session.get('boldColor'), bold: true});
    }
}

function chooseOpacity(thing){
    if(Session.get('selectedType')=='rhyme'){
        Session.set('opacities',$(thing).data('value'));
    }
}


/*function updateSelections(){
    Selections.find().observeChanges({
      added: function (id) {
        $.get(url, {id: id}, function () {
          if (Selections.findOne(id)){
              
        }
        });
      }
});

}*/

Template.poem.events({
       'click .layer': function(event){
        var clickedLayer=event.currentTarget;
        $('.layer').each(function(){
            if(this == clickedLayer){
                $(this).css('opacity', 1.0);
                Session.set('selectedType',$(this).data('name'));
                Session.set('highlightElement',$(clickedLayer).find('.rhymeSelect').val());
                Session.set('curLayer', $(clickedLayer).attr('id'));
            }else{
                $(this).css('opacity',0.5);
            }
        });
        if (Session.get('selectedType')=='bold'){
            var colors=$(clickedLayer).find('.colorSquare');
            Session.set('boldColor', '');
            colors.each(function(){
                if($(this).css('border-width')==='2px'){
                    Session.set('boldColor', $(this).data('color'));
                }
            })
            Session.set('boldElement', $(clickedLayer).find('.boldSelect').val());
        }
        if (Session.get('selectedType')=='rhyme'){
            var colors=$(clickedLayer).find('.colorSquare');
            Session.set('highlightColor', '');
            colors.each(function(){
                if($(this).css('border-width') ==='2px'){
                    Session.set('highlightColor', $(this).data('color'));
                }
            })
            Session.set('highlightElement', $(clickedLayer).find('.rhymeSelect').val());
        }
/*        if (selectedType=='syllable'){
            startSyllables();
        }else{
            stopSyllables();
        }*/
    },
    'keyup .layerName':function(event){
        var newName=$(event.currentTarget).text();
        var layerID=$(event.currentTarget).parent().attr('id');
        var curL_id=Layers.findOne({id:layerID})._id;
        typewatch(function () {
            Layers.update(curL_id, {$set: {name: newName}});
        }, 500);
    },
    'click .addColor': function(event){
        var colorSquare=$('<div class="colorSquare"></div>');
        var rightlightColors=$($(event.target).parent()).find('.highlightColors');
        var ccount=rightlightColors.find('.colorSquare').length;
        colorSquare.data('color', colors[ccount]);
        colorSquare.css('background-color', colors[ccount]);
        rightlightColors.append(colorSquare);
        if(ccount>=colors.length-1){
            $(event.target).css('display','none');
        }
    },
    'click .colorSquare':function(event){
        chooseColor(event.currentTarget);
    },
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
    'change .rhymeSelect':function(event){
        Session.set('highlightElement',$(event.currentTarget).val());
    },
    'change .boldSelect':function(event){
        Session.set('boldElement',$(event.currentTarget).val());
        console.log(Session.get('boldElement'));
    },
    'click .syllablesClear': function(event){
          console.log('hi');
          $('.letter, .space').each(function(){
           if ($(this).css('border-left-color') == 'black'){}
           else{
               if ($(this).css('border-left-color') == 'rgb(255, 0, 0)'){
                $(this).css('border-left', 'none');
                $(this).data('syllable', 'false');   
                var lineSpan = $(this).closest('.poemLine');
                var countSpan = $(lineSpan).find('.lineCount');
                var count = $(countSpan).text();
                count--;
               $(countSpan).text(count);
               }
           }
               });
/*               $('.word').each(function(){
                   $('.syllable').each(function(){
                   if ($(this).prev()){
                   var firstSyl= $(this).prev('.syllable');
                   $(this).prepend($(firstSyl).html()).prev().remove();}
                   });
               });*/
               var idR = SyllableMarkers.find({poem_id: curPoem}).fetch();
               for (var i = 0; i < idR.length; i++){
                  SyllableMarkers.remove(idR[i]._id);}
        },
    'click .line':function(event){
        if(Session.get('selectedType')=='rhyme' && Session.get('highlightElement')=='line'){
            num = Session.get('curLayer').slice(-1);
            if (typeof $(event.currentTarget).data('colorer'+num) === 'undefined'){
                // $(event.currentTarget).css('background-color',Session.get('highlightColor'));
                $(event.currentTarget).data('colorer'+num, []);
                $(event.currentTarget).data('colorer'+num).push(curColor);
                $(event.currentTarget).data('colorer'+num).push(true);
                console.log($(event.currentTarget).data('colorer'+num));
                Selections.insert({poem_id: curPoem, style_id: curStyle, location: $(event.currentTarget).attr('id')});
                var op = $('.opacity:checked').data("value");
                console.log(op);
                curStyle = Styles.insert({poem_id: curPoem, layer_id: Session.get('curLayer'), opacity: op});
                Selections.insert({poem_id: curPoem, style_id: curStyle, location: Session.get('curLayer').slice(-1)});
            }else{
                $(event.currentTarget).data('colorer'+num, null);
                var idR = Selections.find({poem_id: curPoem, location: $(event.currentTarget).attr('id')}).fetch();
                var idRemove = idR[0]._id;
                Selections.remove(idRemove);
                var flag=true;
                for (var i = 0; i < Layers.find({type:'rhyme', poem_id: curPoem}).fetch().length; i++){
                    console.log(i,$(event.currentTarget).data('colorer'+i));
                    if(typeof $(event.currentTarget).data('colorer'+i) !== 'undefined' && $(event.currentTarget).data('colorer'+i) !== null){
                        if ($(event.currentTarget).data('colorer'+i)[1] === true){
                            //$(event.currentTarget).css('background-color', $(event.currentTarget).data('colorer'+i)[0]);
                            flag = false;
                            break;
                        }
                    }
                }
                if (flag){
                     //$(event.currentTarget).css('background-color', 'transparent');
                }
            }
          }
          if(Session.get('selectedType')=='bold' && Session.get('boldElement')=='boldLine'){
            num = Session.get('curLayer').slice(-1);
            Selections.insert({poem_id: curPoem, style_id: Styles.findOne(), location: $(event.currentTarget).attr('id')})
            if (typeof $(event.currentTarget).data('bolder'+num) === 'undefined'){
                $(event.currentTarget).css('color',Session.get('boldColor'));
                $(event.currentTarget).css('font-weight','bold');
                $(event.currentTarget).data('bolder'+num, []);
                $(event.currentTarget).data('bolder'+num).push(Session.get('boldColor'));
                $(event.currentTarget).data('bolder'+num).push(true);
                Selections.insert({poem_id: curPoem, style_id: curStyle, location: $(event.currentTarget).attr('id')});
            }else{
                $(event.currentTarget).removeData('bolder'+num);
                var idR = Selections.find({poem_id: curPoem, location: $(event.currentTarget).attr('id')}).fetch();
                var idRemove = idR[0]._id;
                Selections.remove(idRemove);
                var flag=true;
                for (var i = 0; i < Layers.find({type:'bold', poem_id: curPoem}).fetch().length; i++){
                    if(typeof $(event.currentTarget).data('bolder'+i) !== 'undefined'){
                        if ($(event.currentTarget).data('bolder'+i)[1] === true){
                            $(event.currentTarget).css('color', $(event.currentTarget).data('bolder'+i)[0]);
                            $(event.currentTarget).css('font-weight','bold');
                            flag = false;
                            break;
                        }
                    }
                }
                if (flag){
                     $(event.currentTarget).css('color', 'black');
                    $(event.currentTarget).css('font-weight','normal');
                }
            }
        }
        //Poems.update(Session.get("currentPoem"), {$set: {htmlContent: $('#leftSide').html()}});
      },
      'change .opacity': function(event){
        var op = $(event.currentTarget).data("value");
        console.log(op);
        curStyle = Styles.insert({poem_id: curPoem, layer_id: Session.get('curLayer'), opacity: op});
        Selections.insert({poem_id: curPoem, style_id: curStyle, location: Session.get('curLayer').slice(-1)});
      },
      
      'change .visibility': function(event){
        var idFull = $(event.currentTarget).closest('.layer');
        var id = idFull.attr('id').slice(-1);
        var visible=$(event.currentTarget).is(':checked');
        if($(event.currentTarget).data('layer') =='syllable'){
            if(visible){
                $('.syllable').css('border-color', '#eee');
                $('.syllable').css('min-width', '65px');
                $('.letter, .space').each(function(){
                //must make sure we give this data attribute to other users
                if ($(this).data('syllable') == 'true'){
                    $(this).css('border-left', '3px solid red');
                }
                });
                $('.lineCount').css('opacity','1.0');
            }
            else{
                $('.syllable').css('border-color', 'white');
                $('.syllable').css('min-width', '0px');
                $('.letter, .space').each(function(){
                    $(this).css('border-left', 'none');
                });
                $('.lineCount').css('opacity','0.0');
            }
        }
        if($(event.currentTarget).data('layer')=='rhyme'){
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
            if ($(event.currentTarget).data('layer') =='bold'){
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
                    

    },
    'click .word':function(event){
        if(Session.get('selectedType')=='rhyme' && Session.get('highlightElement')=='word'){
            num = Session.get('curLayer').slice(-1);
            if (typeof $(event.currentTarget).data('colorer'+num) === 'undefined'){
                // $(event.currentTarget).css('background-color',Session.get('highlightColor'));
                $(event.currentTarget).data('colorer'+num, []);
                $(event.currentTarget).data('colorer'+num).push(Session.get('highlightColor'));
                $(event.currentTarget).data('colorer'+num).push(true);
                Selections.insert({poem_id: curPoem, style_id: curStyle, location: $(event.currentTarget).attr('id')});
            }else{
                $(event.currentTarget).data('colorer'+num, null);
                var idR = Selections.find({poem_id: curPoem, location: $(event.currentTarget).attr('id')}).fetch();
                var idRemove = idR[0]._id;
                Selections.remove(idRemove);
                var flag=true;
                for (var i = 0; i < Layers.find({type:'rhyme', poem_id: curPoem}).fetch().length; i++){
                    console.log(i,$(event.currentTarget).data('colorer'+i));
                    if(typeof $(event.currentTarget).data('colorer'+i) !== 'undefined' && $(event.currentTarget).data('colorer'+i) !== null){
                        if ($(event.currentTarget).data('colorer'+i)[1] === true){
                            //$(event.currentTarget).css('background-color', $(event.currentTarget).data('colorer'+i)[0]);
                            flag = false;
                            break;
                        }
                    }
                }
                if (flag){
                     //$(event.currentTarget).css('background-color', 'transparent');
                }
            }
           
        }
        if(Session.get('selectedType')=='bold' && Session.get('boldElement')=='boldWord'){
            num = Session.get('curLayer').slice(-1);
            if (typeof $(event.currentTarget).data('bolder'+num) === 'undefined'){
                $(event.currentTarget).css('color',Session.get('boldColor'));
                $(event.currentTarget).css('font-weight','bold');
                $(event.currentTarget).data('bolder'+num, []);
                $(event.currentTarget).data('bolder'+num).push(Session.get('boldColor'));
                $(event.currentTarget).data('bolder'+num).push(true);
                Selections.insert({poem_id: curPoem, style_id: curStyle, location: $(event.currentTarget).attr('id')});
            }else{
                $(event.currentTarget).removeData('bolder'+num);
                var idR = Selections.find({poem_id: curPoem, location: $(event.currentTarget).attr('id')}).fetch();
                var idRemove = idR[0]._id;
                Selections.remove(idRemove);
                var flag=true;
                for (var i = 0; i < Layers.find({poem_id: curPoem, type:'bold'}).fetch(); i++){
                    if(typeof $(event.currentTarget).data('bolder'+i) !== 'undefined'){
                        if ($(event.currentTarget).data('bolder'+i)[1] === true){
                            $(event.currentTarget).css('color', $(event.currentTarget).data('bolder'+i)[0]);
                            $(event.currentTarget).css('font-weight','bold');
                            flag = false;
                            break;
                        }
                    }
                }
                if (flag){
                     $(event.currentTarget).css('color', 'black');
                    $(event.currentTarget).css('font-weight','normal');
                }
            }
        }
        if (Session.get('selectedType')=='typing' && Session.get('stressElement')=='stressWord'){
            num = Session.get('curLayer').slice(-1);
            console.log('super stress');
            if (typeof $(event.currentTarget).data('stresser'+num) === 'undefined'){
                $(event.currentTarget).data('stresser'+num, []);
                $(event.currentTarget).css('vertical-align','super');
                $(event.currentTarget).data('stresser'+num).push(true);
                Selections.insert({poem_id: curPoem, style_id: curStyle, location: $(event.currentTarget).attr('id')});
            }
            else{
                $(event.currentTarget).removeData('stresser'+num);
                var idR = Selections.find({poem_id: curPoem, location: $(event.currentTarget).attr('id')}).fetch();
                var idRemove = idR[0]._id;
                Selections.remove(idRemove);
                var flag=true;
                for (var i = 0; i < Layers.find({type:'typing', poem_id: curPoem}).fetch().length; i++){
                    console.log(i,$(event.currentTarget).data('stresser'+i));
                    if(typeof $(event.currentTarget).data('stresser'+i) !== 'undefined' && $(event.currentTarget).data('stresser'+i) !== null){
                        if ($(event.currentTarget).data('stresser'+i)[1] === true){
                            flag = false;
                            break;
                        }
                    }
                }
            }
        }
        //Poems.update(Session.get("currentPoem"), {$set: {htmlContent: $('#leftSide').html()}});
    },
    
    'mouseover .letter, .space': function(event){
        if (Session.get('selectedType')=='syllable'){
            ghostMarker(event.currentTarget);
        }
    },
    
    'mouseout .letter, .space':function(event){
        if (Session.get('selectedType')=='syllable'){
            noghostMarker(event.currentTarget);
        }
    },
    'click .letter, .space':function(event){
        if (Session.get('selectedType')=='syllable'){
            clickSyllable(event.currentTarget);
        }
            if(Session.get('selectedType')=='rhyme' && Session.get('highlightElement')=='letter'){
            num = Session.get('curLayer').slice(-1);
            if (typeof $(event.currentTarget).data('colorer'+num) === 'undefined'){
                // $(event.currentTarget).css('background-color',Session.get('highlightColor'));
                $(event.currentTarget).data('colorer'+num, []);
                $(event.currentTarget).data('colorer'+num).push(Session.get('highlightColor'));
                $(event.currentTarget).data('colorer'+num).push(true);
                Selections.insert({poem_id: curPoem, style_id: curStyle, location: $(event.currentTarget).attr('id')});
            }else{
                $(event.currentTarget).data('colorer'+num, null);
                var idR = Selections.find({poem_id: curPoem, location: $(event.currentTarget).attr('id')}).fetch();
                var idRemove = idR[0]._id;
                Selections.remove(idRemove);
                var flag=true;
                for (var i = 0; i < Layers.find({type:'rhyme', poem_id: curPoem}).fetch().length; i++){
                    console.log(i,$(event.currentTarget).data('colorer'+i));
                    if(typeof $(event.currentTarget).data('colorer'+i) !== 'undefined' && $(event.currentTarget).data('colorer'+i) !== null){
                        if ($(event.currentTarget).data('colorer'+i)[1] === true){
                            //$(event.currentTarget).css('background-color', $(event.currentTarget).data('colorer'+i)[0]);
                            flag = false;
                            break;
                        }
                    }
                }
                if (flag){
                     //$(event.currentTarget).css('background-color', 'transparent');
                }
            }
             
          }
          if(Session.get('selectedType')=='bold' && Session.get('boldElement')=='boldLetter'){
            num = Session.get('curLayer').slice(-1);
            if (typeof $(event.currentTarget).data('bolder'+num) === 'undefined'){
                Selections.insert({poem_id: curPoem, style_id: curStyle, location: $(event.currentTarget).attr('id')})
                $(event.currentTarget).css('color',Session.get('boldColor'));
                $(event.currentTarget).css('font-weight','bold');
                $(event.currentTarget).data('bolder'+num, []);
                $(event.currentTarget).data('bolder'+num).push(Session.get('boldColor'));
                $(event.currentTarget).data('bolder'+num).push(true);
            }else{
                $(event.currentTarget).removeData('bolder'+num);
                var idR = Selections.find({poem_id: curPoem, location: $(event.currentTarget).attr('id')}).fetch();
                var idRemove = idR[0]._id;
                Selections.remove(idRemove);
                var flag=true;
                for (var i = 0; i < Layers.find({poem_id: curPoem, type:'bold'}).fetch().length; i++){
                    if(typeof $(event.currentTarget).data('bolder'+i) !== 'undefined'){
                        if ($(event.currentTarget).data('bolder'+i)[1] === true){
                            $(event.currentTarget).css('color', $(event.currentTarget).data('bolder'+i)[0]);
                            $(event.currentTarget).css('font-weight','bold');
                            flag = false;
                            break;
                        }
                    }
                }
                if (flag){
                     $(event.currentTarget).css('color', 'black');
                    $(event.currentTarget).css('font-weight','normal');
                }
            }
        }
        //Poems.update(Session.get("currentPoem"), {$set: {htmlContent: $('#leftSide').html()}});
    },
    'click .syllablesGrid': function(event){
        grid();
    },
    'click .layers-menu':function(event){
        $(".right").animate({ scrollTop: $(document).height() }, "slow");
    },
    'click .newColorLayer':function(event){
        var name = $(event.currentTarget).text();
        var count=Layers.find({poem_id: curPoem, type:'rhyme'}).fetch().length;
        console.log(count);
        if (name == "Other Coloring"){
            name='Click to name this layer!';
        }
        Layers.insert({
          name:name,
          id:'color'+count,
          poem_id:Session.get('currentPoem'),
          type:'rhyme'
      })
    },
    'click .newBoldLayer':function(event){
        var name = $(event.currentTarget).text();
        var count=Layers.find({poem_id: curPoem, type:'bold'}).fetch().length;
        console.log(count);
        if (name == "Other Bolding"){
            name='Click to name this layer!';
        }
        Layers.insert({
          name:name,
          id:'bold'+count,
          poem_id:Session.get('currentPoem'),
          type:'bold'
      })
    },
    'click .newBarsLayer':function(event){
        var name = $(event.currentTarget).text();
        var count=Layers.find({poem_id: curPoem, type:'syllable'}).fetch().length;
        console.log(count);
        if (name == "Other Vertical Bars"){
            name='Click to name this layer!';
        }
        Layers.insert({
          name:name,
          id:'syllable'+count,
          poem_id:Session.get('currentPoem'),
          type:'syllable'
      })
    },
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
'click .puncOption': function(event){
    var lCounter=0,
        wCounter=0,
        cCounter=0;
    if($('.puncOption').data('active')){
            //go back to original, use stored input data?
           /* $('.puncOption').text('Lines by Punctuation');
            $('.puncOption').data('active', false);*/
        }else{
           // $('.puncOption').text('Lines by Linebreaks');
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
                line.attr("id","line"+ lCounter);
                var inside = $('<span class="line col-md-11">');
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
 }} });


    function setHeights(){
        var halfies = $(window).height();
        $('.left').css('height',halfies);
        $('.right').css('height',halfies);
    }

    //make each alphanumeric character/space/word/line a span with seperate class
    function makeSpans() {
        console.log($('.poem').html());
        $('.poemLine').each(function(){
            console.log('MEEP');
            var elements = $(this).text().split('');
            $(this).text('');
            var line = $('<span class="line col-md-11">');
            line.attr("id","line"+ lineCounter);
            $(this).append(line);
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
            $(this).append(lineCount);
        });
        
    }
    


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
            //console.log(intervals);
            
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
           $('.syllable').each(function(){
           var firstSyl= $(this).prev('.syllable');
           $(this).prepend($(firstSyl).html().prev().remove())
           });
       });
        $('.syllable').css('display', 'inline');
        //$('.syllable').css('border', 'none');
        $('.syllable').css('min-width', '0');
        $('.syllablesGrid').data('gridded',false);
    }
}

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
        var lineSpan = $(thing).closest('.poemLine');
        var countSpan = $(lineSpan).find('.lineCount');
        var count = $(countSpan).text();
        if ($(thing).css('border-left-color') == "rgb(255, 0, 0)"){
            $(thing).css('border-left', 'none');
            $(thing).data('syllable', 'false');
            count--;
            $(countSpan).text(count);
            var syl = SyllableMarkers.find({location: $(thing).attr("id"), poem_id: curPoem}).fetch(); 
            console.log(syl);
            SyllableMarkers.remove(syl[0]._id);
            /*var secondSyl= $(thing).closest('.syllable');
            var firstSyl= $(secondSyl).prev('.syllable');
            $(secondSyl).prepend($(firstSyl).html()).prev().remove();*/
        }
        else{
            $(thing).css('border-left', '3px solid red');
            $(thing).data('syllable', 'true');
            count++;
            $(countSpan).text(count);
            var syl = SyllableMarkers.find({location: $(thing).attr("id"), poem_id: curPoem}).fetch(); 
            SyllableMarkers.insert({location: $(thing).attr("id"), poem_id: curPoem});
        }
    }  
    
    function stopSyllables(){
        $('.poem').off("mouseover", ".letter, .space", ghostMarker);
        $('.poem').off("mouseout", ".letter, .space", noghostMarker);
        $('.poem').off("click", ".letter, .space", clickSyllable);
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
    
//must update selections and styles
function boldSetup(id){  
    for (i=0;i<2;i++){
       var colorSquare=$('<div class="colorSquare"></div>');
       colorSquare.data('color', darkColors[i]);
       colorSquare.css('background-color', darkColors[i]);
       var highlight = $('#' +'bold'+ id).find('.boldColors');
      $(highlight).append(colorSquare);
    }
}

function startSyllables(){
    $('.poem').off("click", ".letter, .space", clickSyllable);
    $('.poem').on("mouseover", ".letter, .space", ghostMarker);
    $('.poem').on("mouseout", ".letter, .space", noghostMarker);
    $('.poem').on("click", ".letter, .space", clickSyllable);
}




   /*function throttle(f, delay){
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
   }));*/
   
    
    var newPoem = $("<div class='overlay close overlay-hugeinc'>");
    $(newPoem).append("<button type='button' class='overlay-close' id='overlay-closed'>Close</button>");
    $(newPoem).append("<span class='newPoem'>");
    $(newPoem).append("<textarea class='editPoem' id='editPoem'>");
    $(newPoem).append("</textarea></span></div>");
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
    
////////////////////////////////////////////////////////////////////////////////
/*    //meteor style of document.ready
    Template.poem.rendered=function(){
        console.log("start rendered");
        //makeSpans();
        console.log("done rendered");
        //currentPoem set in routes.js
        //initialCount();
        //generalSetup();
        colorSetup('0');
        syllableSetup();
        //default layers
        curPoem = Session.get("currentPoem");
        Layers.insert({id: "typing0", poem_id: curPoem , name: "Text"});
        Layers.insert({id: "rhyme0", poem_id: curPoem , name: "Rhyme"});
        Layers.insert({id: "syllable0", poem_id: curPoem , name: "Syllable"});
    }*/
    
    ///////////////////////////
    // Once the poem is rendered, run a query for all selections
    // When a selection is added, update the HTML of the poem using
    // the identifiers you gave it for every line, word, etc.
    ///////////////////////////
     Template.poem.rendered=function(){
       Session.set('highlightElement','line');
       Session.set('boldElement', 'boldLine');
       Session.set('opacities', '1.0');
       Session.set('stressElement','Syllable');
         //need to use local Storage?
        if($('.puncOption').data('active')){
             $(".puncOption").remove();
         }
         curPoem = Session.get("currentPoem");
        var selectionsCursor = Selections.find({poem_id:Session.get('currentPoem')});
        selectionsCursor.observe({
          added: function (selection, beforeIndex) {
            var location = selection.location;
            var styleID = selection.style_id;
            var style = Styles.find({_id:styleID}).fetch();
            console.log(style);
            if ((style[0].background_color !== null)&&(typeof style[0].background_color !== "undefined")) {
               var substring = style[0].background_color.substr(1);
               $('#'+location).addClass("color"+substring);
               $('#'+location).data('colorer'+num, []);
               $('#'+location).data('colorer'+num).push(curColor);
               $('#'+location).data('colorer'+num).push(true);
            }
            if ((style[0].font_color !== null)&&(typeof style[0].font_color !== "undefined")) {
                var substring = style[0].font_color.substr(1);
                $('#'+location).data('bolder'+num, []);
                $('#'+location).data('bolder'+num).push(Session.get('boldColor'));
                $('#'+location).data('bolder'+num).push(true);
                $('#'+location).addClass("bold"+substring);
            }
            if ((style[0].bold !== null)&&(typeof style[0].bold !== "undefined")) {
                var substring = style[0].bold;
                $('#'+location).addClass("bold"+substring);
            }
            if ((style[0].opacity !== null)&&(typeof style[0].opacity !== "undefined")) {
              //we really need to switch from data to searching all selections, styles, layer!!!
                  $(".line, .letter, .word, .space").each(function() {
                    if (($(this).data('colorer'+location) !== null)&&($(this).data('colorer'+location) !== undefined)){
                    var rgb = $(this).css('background-color');
                    var mid = rgb.split("(")[1];
                    var middl = mid.split(")")[0];
                    var rgbaArray = middl.split(",");
                    var middle = rgbaArray[0]+", "+rgbaArray[1]+", "+rgbaArray[2];
                    $(this).css("background", "rgba( "+middle+", "+style[0].opacity+")");
                    }
               }) }
          },
          removed: function (selection, beforeIndex) {
              console.log('remove');
            var location = selection.location;
            console.log('loc',location);
            var styleID = selection.style_id;
            var style = Styles.find({_id:styleID}).fetch();
            if ((style[0].background_color !== null)&&(typeof style[0].background_color !== "undefined")) {
               var substring = style[0].background_color.substr(1);
               $('#'+location).removeData('colorer'+num);
               $('#'+location).removeClass("color"+substring);
            }
            if ((style[0].font_color !== null)&&(typeof style[0].font_color !== "undefined")) {
                var substring = style[0].font_color.substr(1);
                $('#'+location).removeData('bolder'+num);
                $('#'+location).removeClass("bold" + substring);
            }
            if ((style[0].bold !== null)&&(typeof style[0].bold !== "undefined")) {
                var substring = style[0].bold;
                $('#'+location).removeClass("bold"+substring);
            }
          }
        });
          var syllablesCursor = SyllableMarkers.find({poem_id:Session.get('currentPoem')});
          syllablesCursor.observe({
            added: function (selection, beforeIndex) {
            var location = selection.location;
            console.log(location);
            $('#'+location).addClass("syllableStyle");
            $('#'+location).data('syllable', 'true'); 
            console.log('wrong');
            },
            removed: function (selection, beforeIndex) {
            var location = selection.location;
            console.log(location+":)            . ");
            $('#'+location).removeClass("syllableStyle");
            $('#'+location).data('syllable', 'false');   
            } });
            
            // setHeights();
        };