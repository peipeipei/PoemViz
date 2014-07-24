var colors=['rgba(255,153,153,1)','rgba(255,153,255,1)','rgba(221,153,255,1)','rgba(170,153,255,1)', "rgba(153,204,255,1)",'rgba(153,255,255,1)', 'rgba(153, 255, 170,1)','rgba(204,255,153,1)', 'rgba(255,255,153,1)', 'rgba(255,204,153,1)'];
var darkColors=['rgba(0,0,0,1)','rgba(0,102,51,1)','rgba(0,0,153,1)','rgba(85,0,102,1)','rgba(102,0,34,1)'];
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
var linesHandle=Meteor.subscribe('lineCounts');

Handlebars.registerHelper("equals", function (a, b) {
  return (a == b);
});

checkIsReady = function(){
    console.log('ready!');
  return poemsHandle.ready()&&layersHandle.ready()&&selectionsHandle.ready()&&stylesHandle.ready()&&syllablesHandle.ready()&&linesHandle.ready();
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

Template.poem.events({
       'click .layer': function(event){
        var clickedLayer=event.currentTarget;
        $('.layer').each(function(){
            if(this == clickedLayer){
                $(this).css('opacity', 1.0);
                Session.set('selectedType',$(this).data('name'));
                Session.set('curLayer', $(clickedLayer).attr('id'));
            }else{
                $(this).css('opacity',0.5);
            }
        });
        if (Session.get('selectedType')=='bold'){
            var colors=$(clickedLayer).find('.colorSquare');
            Session.set('boldColor', darkColors[0]);
            colors.each(function(){
                if($(this).css('border-width')==='2px'){
                    Session.set('boldColor', $(this).data('color'));
                }
            })
            Session.set('boldElement', $(clickedLayer).find('.boldSelect').val());
        }
        if (Session.get('selectedType')=='rhyme'){
            var colors=$(clickedLayer).find('.colorSquare');
            Session.set('highlightColor', colors[0]);
            colors.each(function(){
                if($(this).css('border-width') ==='2px'){
                    Session.set('highlightColor', $(this).data('color'));
                }
            })
            Session.set('highlightElement', $(clickedLayer).find('.rhymeSelect').val());
            curStyle=Styles.insert({poem_id: Session.get("currentPoem"), layer_id: Session.get('curLayer'), background_color: Session.get('highlightColor')});
        }
        if (Session.get('selectedType')=='stressing'){
            Session.set('stressElement', $(clickedLayer).find('.stressSelect').val());
        }
        
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
    'change .stressSelect':function(event){
        Session.set('stressElement',$(event.currentTarget).val());
        console.log(Session.get('stressElement'));
    },
    'click .syllablesClear': function(event){
          console.log('hi');
          $('.letter, .space').each(function(){
           if ($(this).hasClass('syllableStyle')){
                $(this).css('border-left', 'none');
                $(this).data('syllable', 'false');   
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
    'click .line':function(event){
        if(Session.get('selectedType')=='rhyme' && Session.get('highlightElement')=='line'){
            num = Session.get('curLayer').slice(-1);
            console.log('hi');
            var flag = true;
            var possibleSelections = Selections.find({poem_id: curPoem, location: $(event.currentTarget).attr('id')}).fetch();
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
                Selections.insert({poem_id: curPoem, style_id: curStyle, location: $(event.currentTarget).attr('id')});
                var op = $('.opacity:checked').data("value");
                var opStyle = Styles.insert({poem_id: curPoem, layer_id: Session.get('curLayer'), opacity: op});
                Selections.insert({poem_id: curPoem, style_id: opStyle, location: Session.get('curLayer').slice(-1)});
            }else{
               var idR = Selections.find({poem_id: curPoem, location: $(event.currentTarget).attr('id')}).fetch();
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
                console.log('remove', target._id)
                Selections.remove(target._id);
            }
          }
          if(Session.get('selectedType')=='bold' && Session.get('boldElement')=='boldLine'){
            num = Session.get('curLayer').slice(-1);
            console.log('hi');
            var flag = true;
            var possibleSelections = Selections.find({poem_id: curPoem, location: $(event.currentTarget).attr('id')}).fetch();
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
                Selections.insert({poem_id: curPoem, style_id: curStyle, location: $(event.currentTarget).attr('id')});
            }else{
               var idR = Selections.find({poem_id: curPoem, location: $(event.currentTarget).attr('id')}).fetch();
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
                Selections.remove(target._id);
            }
        }
    },
        
      'change .opacity': function(event){
        var op = $(event.currentTarget).data("value");
        console.log(op);
        curStyle = Styles.insert({poem_id: curPoem, layer_id: Session.get('curLayer'), opacity: op});
        Selections.insert({poem_id: curPoem, style_id: curStyle, location: Session.get('curLayer').slice(-1)});
      },
      
      'change .visibility': function(event){
        var idFull = this._id;
        var visible=$(event.currentTarget).is(':checked');
        var visibleLayers = Session.get('visibleLayers') || [];
        if (visible){
           var ifContained = _.contains(visibleLayers, idFull);
           if (!ifContained){
             visibleLayers.push(idFull);
             Session.set('visibleLayers',visibleLayers);
           }
        }
        else{
           var ifContained = _.contains(visibleLayers, idFull);
           if (ifContained){
             var spliced = visibleLayers.splice(visibleLayers.indexOf(idFull), 1);
             Session.set('visibleLayers',visibleLayers);
           }
        }
        
        if($(event.currentTarget).data('layer') =='syllable'){
            if(visible){
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
        /*if($(event.currentTarget).data('layer')=='rhyme'){
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
                } */
                    

    },
    'click .word':function(event){
        if(Session.get('selectedType')=='rhyme' && Session.get('highlightElement')=='word'){
            num = Session.get('curLayer').slice(-1);
            console.log('hi');
            var flag = true;
            var possibleSelections = Selections.find({poem_id: curPoem, location: $(event.currentTarget).attr('id')}).fetch();
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
                Selections.insert({poem_id: curPoem, style_id: curStyle, location: $(event.currentTarget).attr('id')});
                var op = $('.opacity:checked').data("value");
                var opStyle = Styles.insert({poem_id: curPoem, layer_id: Session.get('curLayer'), opacity: op});
                Selections.insert({poem_id: curPoem, style_id: opStyle, location: Session.get('curLayer').slice(-1)});
            }else{
               var idR = Selections.find({poem_id: curPoem, location: $(event.currentTarget).attr('id')}).fetch();
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
                Selections.remove(target._id);
            }
        }
        if(Session.get('selectedType')=='bold' && Session.get('boldElement')=='boldWord'){
            num = Session.get('curLayer').slice(-1);
            console.log('hi');
            var flag = true;
            var possibleSelections = Selections.find({poem_id: curPoem, location: $(event.currentTarget).attr('id')}).fetch();
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
                Selections.insert({poem_id: curPoem, style_id: curStyle, location: $(event.currentTarget).attr('id')});
            }else{
               var idR = Selections.find({poem_id: curPoem, location: $(event.currentTarget).attr('id')}).fetch();
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
                Selections.remove(target._id);
            }
        }
        if (Session.get('selectedType')=='stressing' && Session.get('stressElement')=='stressWord'){
            var selStyle=Layers.findOne({id:Session.get('curLayer'), poem_id:Session.get('currentPoem')}).style;
            if ($(event.currentTarget).hasClass('stressStyle')){
                var idR = Selections.find({poem_id: curPoem, style_id: selStyle, location: $(event.currentTarget).attr('id')}).fetch();
                var idRemove = idR[0]._id;
                Selections.remove(idRemove);   
            }else{
                Selections.insert({poem_id: curPoem, style_id: selStyle, location: $(event.currentTarget).attr('id')});
            }
/*            num = Session.get('curLayer').slice(-1);
            console.log('super stress');
            if (typeof $(event.currentTarget).data('stresser'+num) === 'undefined'){
                $(event.currentTarget).data('stresser'+num, []);
                $(event.currentTarget).css('vertical-align','super');
                $(event.currentTarget).data('stresser'+num).push(true);
                Selections.insert({poem_id: curPoem, style_id: curStyle, location: $(event.currentTarget).attr('id')});
                console.log('supposedly inserted', Styles.find(curStyle).fetch());
            }
            else{
                $(event.currentTarget).removeData('stresser'+num);
                var idR = Selections.find({poem_id: curPoem, location: $(event.currentTarget).attr('id')}).fetch();
                var idRemove = idR[0]._id;
                Selections.remove(idRemove);
                console.log('REMOOOVE');
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
                if (flag){
                     $(event.currentTarget).css('vertical-align', 'baseline');
                }
            }*/
        }
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
            console.log('hi');
            var flag = true;
            var possibleSelections = Selections.find({poem_id: curPoem, location: $(event.currentTarget).attr('id')}).fetch();
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
                Selections.insert({poem_id: curPoem, style_id: curStyle, location: $(event.currentTarget).attr('id')});
                var op = $('.opacity:checked').data("value");
                var opStyle = Styles.insert({poem_id: curPoem, layer_id: Session.get('curLayer'), opacity: op});
                Selections.insert({poem_id: curPoem, style_id: opStyle, location: Session.get('curLayer').slice(-1)});
            }else{
               var idR = Selections.find({poem_id: curPoem, location: $(event.currentTarget).attr('id')}).fetch();
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
                Selections.remove(target._id);
            }
          }
          if(Session.get('selectedType')=='bold' && Session.get('boldElement')=='boldLetter'){
            num = Session.get('curLayer').slice(-1);
            console.log('hi');
            var flag = true;
            var possibleSelections = Selections.find({poem_id: curPoem, location: $(event.currentTarget).attr('id')}).fetch();
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
                Selections.insert({poem_id: curPoem, style_id: curStyle, location: $(event.currentTarget).attr('id')});
            }else{
               var idR = Selections.find({poem_id: curPoem, location: $(event.currentTarget).attr('id')}).fetch();
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
                Selections.remove(target._id);
            }
        }
        if (Session.get('selectedType')=='stressing' && Session.get('stressElement')=='stressLetter'){
            var selStyle=Layers.findOne({id:Session.get('curLayer'), poem_id:Session.get('currentPoem')}).style;
            if ($(event.currentTarget).hasClass('stressStyle')){
                var idR = Selections.find({poem_id: curPoem, style_id: selStyle, location: $(event.currentTarget).attr('id')}).fetch();
                var idRemove = idR[0]._id;
                Selections.remove(idRemove);   
            }else{
                Selections.insert({poem_id: curPoem, style_id: selStyle, location: $(event.currentTarget).attr('id')});
            }
        }
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
       var layerID = Layers.insert({
          name:name,
          id:'color'+count,
          poem_id:Session.get('currentPoem'),
          type:'rhyme'
      })
     var visibleLayers = Session.get('visibleLayers');
     console.log('addedLayer',layerID)
      visibleLayers.push(layerID);
      Session.set('visibleLayers',visibleLayers);
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


    function setHeights(){
        var halfies = $(window).height();
        $('.left').css('height',halfies);
        $('.right').css('height',halfies);
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
          var letters=$(this).find('.letter');
          $(this).find('.syllable').remove();
          var oneSyl=$('<span class=syllable>');
          letters.each(function(){
            $(oneSyl).append(this);
          })
          $(this).append(oneSyl);
  /*         $('.syllable').each(function(){
           var firstSyl= $(this).prev('.syllable');
           $(this).prepend($(firstSyl).html().prev().remove())
           });*/
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
        var wordCount=$(lineSpan).find('.word').length;
        if ($(thing).css('border-left-color') == "rgb(255, 0, 0)"){
            $(thing).css('border-left', 'none');
            $(thing).data('syllable', 'false');
            var syl = SyllableMarkers.find({location: $(thing).attr("id"), poem_id: curPoem}).fetch(); 
            console.log(syl);
            SyllableMarkers.remove(syl[0]._id);
        }
        else{
            $(thing).css('border-left', '3px solid red');
            $(thing).data('syllable', 'true');
            var syl = SyllableMarkers.find({location: $(thing).attr("id"), poem_id: curPoem}).fetch(); 
            SyllableMarkers.insert({location: $(thing).attr("id"), poem_id: curPoem});
        }
        var sylCount=0;
        $(lineSpan).find('.letter').each(function(){
            if ($(this).hasClass('syllableStyle')===true){
                sylCount++; 
            }
        })
        $(countSpan).text(wordCount+sylCount);
        
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
         displaySelections();
     }
     Deps.autorun(function (c) {
        var visibleLayers = Session.get("visibleLayers");
        //console.log(visibleLayers,"hi");
        displaySelections();
        });
     function displaySelections(){
       Session.set('highlightElement','line');
       Session.set('boldElement', 'boldLine');
       //put in database??
       Session.set('opacities', '1.0');
       Session.set('stressElement','stressWord');
       curPoem = Session.get("currentPoem");
       var visibleLayers = _.pluck(Layers.find({poem_id: curPoem}).fetch(), "_id");
       Session.set('visibleLayers', visibleLayers);
        if($('.puncOption').data('active')){
             $(".puncOption").remove();
         }
        var selectionsCursor = Selections.find({poem_id:Session.get('currentPoem')});
        selectionsCursor.observe({
          added: function (selection, beforeIndex) {
            var location = selection.location;
            var styleID = selection.style_id;
            var style = Styles.find({_id:styleID}).fetch();
            if (style.length > 0){
            var layerNodeID = style[0].layer_id;
            var layerID = Layers.findOne({id: layerNodeID})._id;
           // if (_.contains(Session.get('visibleLayers'),layerID)){
            if ((style[0].background_color !== null)&&(typeof style[0].background_color !== "undefined")) {
               var substring = style[0].background_color;
               $("#"+location).css(
                {
                    "background-color": substring
                    
                }
               );
            }
            if ((style[0].font_color !== null)&&(typeof style[0].font_color !== "undefined")) {
                var substring = style[0].font_color;
                $("#"+location).css(
                 {
                    "color": substring
                 }
                );
            }
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
            if ((style[0].opacity !== null)&&(typeof style[0].opacity !== "undefined")) {
                var allColorStylesofLayer = Styles.find({layer_id: "color"+location}).fetch();
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
            if((style[0].verticalAlign !== null)&&(typeof style[0].verticalAlign !== "undefined")){
                $("#"+location).addClass('stressStyle');
            }
            }
            else{
               // console.log('notshowingselection'+layerID)
            }
           // }
          },
            removed: function (selection, beforeIndex) {
            var location = selection.location;
            var styleID = selection.style_id;
            var style = Styles.find({_id:styleID}).fetch();
            if (style.length > 0){
            if ((style[0].background_color !== undefined)) {
                var substring = "transparent";
                var allSelections = Selections.find({location: location}).fetch();
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
            if ((style[0].font_color !== null)&&(typeof style[0].font_color !== "undefined")) {
                $("#"+location).css(
                {
                    "color": "black"
                }
               );
            }
            if ((style[0].bold !== null)&&(typeof style[0].bold !== "undefined")) {
                $("#"+location).css(
                {
                    "font-weight": "normal"
                }
               );
            }
            if((style[0].verticalAlign !== null)&&(typeof style[0].verticalAlign !== "undefined")){
                var substring = 'baseline';
                $("#"+location).removeClass('stressStyle');
            }

          }
            }
        });
          var syllablesCursor = SyllableMarkers.find({poem_id:Session.get('currentPoem')});
          syllablesCursor.observe({
            added: function (selection, beforeIndex) {
            var location = selection.location;
            $('#'+location).addClass("syllableStyle");
            $('#'+location).data('syllable', 'true'); 
            },
            removed: function (selection, beforeIndex) {
            var location = selection.location;
            console.log(location+":)            . ");
            $('#'+location).removeClass("syllableStyle");
            $('#'+location).data('syllable', 'false');   
            } 
          });
            
            // setHeights();
        };