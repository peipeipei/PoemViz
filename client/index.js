//default colors for highlighting (sound, words layers)
colors=['rgba(255,153,153,1)','rgba(255,153,255,1)','rgba(221,153,255,1)','rgba(170,153,255,1)', "rgba(153,204,255,1)",'rgba(153,255,255,1)', 'rgba(153, 255, 170,1)','rgba(204,255,153,1)', 'rgba(255,255,153,1)', 'rgba(255,204,153,1)'];
//default colors for bolding (bolding layers)
darkColors=['rgba(0,0,0,1)','rgba(0,102,51,1)','rgba(0,0,153,1)','rgba(85,0,102,1)','rgba(102,0,34,1)'];
//used to store the current poem
curPoem=Session.get('currentPoem');
//defaults
Session.set('highlightElement','line');
Session.set('boldElement','boldLine');
//used to store the current style
curStyle = "";
//used to store the current layer (the number of the layer ID)
num  = "";
//used to get current clicked syllable
firstID= "";
lastID = ''; 
doLast = '';

//METEOR SETUP
var poemsHandle = Meteor.subscribe('poems');
var layersHandle=Meteor.subscribe('layers');
var selectionsHandle=Meteor.subscribe('selections');
var stylesHandle=Meteor.subscribe('styles');
var syllablesHandle=Meteor.subscribe('syllableMarkers');
var linesHandle=Meteor.subscribe('lineCounts');
var shoutkeysHandle=Meteor.subscribe('shoutkeys');

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

typewatch = (function(){
   var timer = 0;
   return function(callback, ms){
     clearTimeout (timer);
     timer = setTimeout(callback, ms);
   }  
 })();

// Cool meteor thing that runs automatically whenever a variable it gets is reset (in this case, "curLayer")
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
    }
    
    // Scrolls partial layers up or down. Also has means that when you create a new layer, it automatically scrolls to be on screen.
    if (clickedLayer.position() != undefined){
        var scrolledPos = $("#layers").scrollTop();
        var layerPos = clickedLayer.position().top;
        var layerHeight = clickedLayer.height();
        var parentPadding = clickedLayer.parent().innerWidth() - clickedLayer.parent().width();
        var parentHeight = clickedLayer.parent().height() - parentPadding;
        
        // if a layer is partially out of view from above, bring it down when you select it
        if (layerPos < 0){
            $("#layers").scrollTop(scrolledPos + layerPos);
        }
        // if a layer is partially out of view from below, bring it up when you select it
        else if (layerPos + layerHeight > parentHeight){
            $("#layers").scrollTop(scrolledPos + layerPos - parentHeight + layerHeight);
        }
    }
    
});
    
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
              $(location).addClass('stressStyle');
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
                $(location).removeClass('stressStyle');
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