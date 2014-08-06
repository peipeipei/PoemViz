//five aethestically pleasing sets of colors to use (six colors in each)
colorsSailboat =["rgba(255,131,98,1)","rgba(187,115,101,1)","rgba(222,173,161,1)","rgba(255,255,204,1)","rgba(60,70,99,1)","rgba(109,116,140,1)"];
colorsRainbow = ['rgba(241,103,69,1)', 'rgba(255,198,93,1)','rgba(123,200,164,1)','rgba(76,195,217,1)','rgba(147,100,141,1)','rgba(190,190,190,1)'];
colorsPastelOcean = ['rgba(190,214,97,1)','rgba(137,232,148,1)','rgba(120,213,227,1)','rgba(122,245,245,1)','rgba(52,221,221,1)','rgba(147,226,213,1)'];
colorsSciFiDream = ['rgba(209,232,238,1)', 'rgba(246,231,245,1)', 'rgba(255,211,224,1)', 'rgba(254,250,246,1)', 'rgba(214,223,226,1)', 'rgba(185,202,143,1)'];
colorsSorbet = ['rgba(222,84,139,1)','rgba(222,138,171,1)','rgba(222,197,207,1)','rgba(240,197,170,1)','rgba(218,222,209,1)','rgba(118,222,182,1)'];   
    
//and a random one to keep cycling through as long as users continue to add layers (the old default)
colorsGeneral = ['rgba(255,153,153,1)','rgba(255,153,255,1)','rgba(221,153,255,1)','rgba(170,153,255,1)', "rgba(153,204,255,1)",'rgba(153,255,255,1)', 'rgba(153, 255, 170,1)','rgba(204,255,153,1)', 'rgba(255,255,153,1)', 'rgba(255,204,153,1)'];

//default colors for highlighting (sound, words layers)
colors=['rgba(255,153,153,1)','rgba(255,153,255,1)','rgba(221,153,255,1)','rgba(170,153,255,1)', "rgba(153,204,255,1)",'rgba(153,255,255,1)', 'rgba(153, 255, 170,1)','rgba(204,255,153,1)', 'rgba(255,255,153,1)', 'rgba(255,204,153,1)'];
//default colors for bolding (bolding layers)
darkColors=['rgba(0,0,0,1)','rgba(0,102,51,1)','rgba(0,0,153,1)','rgba(85,0,102,1)','rgba(102,0,34,1)'];
//defaults
Session.set('highlightElement','line');
Session.set('boldElement','boldLine');
//used to store the current style
//used to store the current layer (the number of the layer ID)
num  = "";
//used to get current clicked syllable
firstID= "";
lastID = ''; 
doLast = '';
//one hour
EXPIRATION_TIME = 1000*60*60;

//METEOR SETUP
Handlebars.registerHelper("equals", function (a, b) {
  return (a == b);
});

//var poemsHandle = Meteor.subscribe('poems');
//var layersHandle=Meteor.subscribe('layers');
//var selectionsHandle=Meteor.subscribe('selections');
//var stylesHandle=Meteor.subscribe('styles');
//var syllablesHandle=Meteor.subscribe('syllableMarkers');
//var linesHandle=Meteor.subscribe('lineCounts');
var shoutkeysHandle=Meteor.subscribe('shoutkeys');
var colorIndicesHandle=Meteor.subscribe('colorIndices');
var colorsHandle=Meteor.subscribe('colors');

Handlebars.registerHelper("equals", function (a, b) {
  return (a == b);
});

//console.log = function() {}

//makes sure that all your collections are ready before loading the page
checkIsReady = function(){
    console.log('ready!');
    return true;
 /* return  poemsHandle.ready()&&layersHandle.ready()&&selectionsHandle.ready()&&stylesHandle.ready()&&syllablesHandle.ready()&&shoutkeysHandle.ready()&&colorIndicesHandle.ready()&&colorsHandle.ready();*/
}

Template.poem.isReady=function(){
    return true;
    return checkIsReady();
}

//returns all the layers in the database
Template.poem.layer=function(){
    // array of all the current layers the poem has
    var poemLayers = Layers.find({poem_id:Session.get('currentPoem')}).fetch();
    // for any layers with color options, display the color choices
    _.each(poemLayers, function(i){
        if (i.type == "rhyme") {
            var layerID = i._id;
            var layerColors = Colors.find({layer_id:layerID}).fetch();
            /*
            var visibleColors = []
            for (var j = 0; j < layerColors.length; j++){
                visibleColors.push({"color": layerColors[j].color_value , "colorName": layerColors[j].name});  
                
            }
            
            i['colorOptions'] = visibleColors;
            */
            i['colorOptions'] = layerColors
            
        }
//        else if (i.type == "bold"){
//            var layerID = i._id;
//            var layerColors = Colors.find({layer_id:layerID}).fetch();
//            var visibleColors = []
//            for (var j = 0; j < layerColors.length; j++){
//                visibleColors.push({"color": layerColors[j].color_value , "colorName": "new name"});  
//            }
//            i['colorOptions'] = visibleColors;
//        }
    })
    return poemLayers;
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
    console.log("testing");
    var clickedLayerID = Session.get('curLayer');
    var clickedLayer = $('#' + clickedLayerID);
    // differentiates between the page loading initially and the layer being clicked (either from physically clicking it or from autoclicking a new layer)
    var layerWasClicked = (clickedLayer.position() != undefined);
    //for each layer, make the one the user has most recently created or selected light blue
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
        //make sure user selects element as indicated by the dropdown
        var dropdown = $(clickedLayer).find('.boldSelect:first');
        Session.set('boldElement', $(dropdown).val());
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
    }
    else if (Session.get('selectedType')=='rhyme'){
        console.log("blah");
         //make sure user selects element as indicated by the dropdown
        var dropdown = $(clickedLayer).find('.rhymeSelect:first');
        Session.set('highlightElement', $(dropdown).val());
        var colorSquares=$(clickedLayer).find('.colorSquare');
        var noneColored=true;
        //set default color if necessary (on the re-selection of layer)
        colorSquares.each(function(){
          console.log($(this).hasClass('selectedColorSquare'));
           if($(this).hasClass('selectedColorSquare')){
                noneColored=false;
            } 
        })
        
        if (layerWasClicked){
            var layerID = Layers.findOne({id:clickedLayerID})._id;
            // if a layer doesn't currently have any colors, give it two default colors
            if (Colors.find({layer_id:layerID}).fetch().length === 0){
                addColor();
                addColor();
            }
        }
        // if a layer is selected and no color is selected, autoselect the first color
        if (noneColored){
          chooseColor(colorSquares[0]);  
        }
    }
    
    // Scrolls partial layers up or down. Also has means that when you create a new layer, it automatically scrolls to be on screen.
    if (layerWasClicked){
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
         console.log("RENDER");
         shoutkeyKey = Shoutkeys.findOne({poem_id: Session.get('currentPoem')}).key;
         shoutkeyID = Shoutkeys.findOne({poem_id: Session.get('currentPoem')})._id;
         $('#shoutkey').text("This poem can also be found at: poemviz.meteor.com/"+shoutkeyKey);
         //expire shoutkey after an hour
         handleid = Meteor.setTimeout(function() {Shoutkeys.remove(shoutkeyID); console.log('woohoo!');}, EXPIRATION_TIME);
         displaySelections();
         syllableCounts();
         $('.layer').each(function(){
             if ($(this).attr('data-name') == 'rhyme'){
                 var name = $(this).attr('id');
                 //set opacity as left before refresh
                 var opacity = Layers.findOne({poem_id: Session.get('currentPoem'), id: name}).opacity;
                 //sometimes string, sometimes number
                 console.log(opacity);
                 switch (opacity){
                         case '1': 
                         var num = 0;
                         break;
                         
                         case 1: 
                         var num = 0;
                         break;
                         
                         case '.6': 
                         var num = 1;
                         break;
                         
                         case .6: 
                         var num = 1;
                         break;
                         
                         case '.2': 
                         var num = 2;
                         break;
                         
                         case .2: 
                         var num = 2;
                         break;

                         case '0': 
                         var num = 3;
                         break;
                         
                         case 0: 
                         var num = 3;
                         break;
                 }
                 console.log("num"+num);
                $('input:radio[name='+name+']:nth('+num+')').attr('checked',true);
         }
         });
     }
     
     //what to do upon rendering of poem
    function displaySelections(){
        //defaults
        Session.set('breaksOption','origOption');
        Session.set('highlightElement','line');
        Session.set('boldElement','boldLine');
        var selectionsCursor = Selections.find({poem_id:Session.get('currentPoem')});
        selectionsCursor.observe({
          //when something is added to the Selections Collection
          added: function (selection, beforeIndex) {
              console.log('added called');
            var location = selection.location;
            var styleID = selection.style_id;
            var style = Styles.find({_id:styleID}).fetch();
              console.log(location);
              console.log(style);
            //used to catch errors
            if (style.length > 0){
            var layerNodeID = style[0].layer_id;
            var layerID = Layers.findOne({poem_id: Session.get('currentPoem'), id: layerNodeID})._id;
            //if selection is from highlighting style/layer
            if ((style[0].background_color !== null)&&(typeof style[0].background_color !== "undefined")) {
               var rgb = style[0].background_color;
               var substring = rgb.substr(4);
               substring = substring.slice(0, -1);
               var curRGBA = 'rgba('+substring+', ';
               console.log(curRGBA);
               /*var lastIndex = rgba.lastIndexOf(",");
               var substring = rgba.substr(0, lastIndex+1);*/
               //check opacity of layer that made the selection
               var op = Layers.findOne(layerID).opacity;
               $("."+location).css(
                {
                    "background": curRGBA+op+")"
                });
            }
            //if selection is from bolding style/layer
            if ((style[0].font_color !== null)&&(typeof style[0].font_color !== "undefined")) {
                var substring = style[0].font_color;
                $("."+location).css(
                 {
                    "color": substring
                 }
                );
            }
            //if selection is from bolding style/layer
            if ((style[0].bold !== null)&&(typeof style[0].bold !== "undefined")) {
                var substring = style[0].bold;
                if (substring){
                $("."+location).css(
                 {
                    "font-weight": "bold"
                 }
                );
                }
            }
            //if selection is from stressing style/layer
            if((style[0].verticalAlign !== null)&&(typeof style[0].verticalAlign !== "undefined")){
                location = location.substr(1);
              $('.'+location).css('vertical-align','super');
              $('.'+location).addClass('stressStyle');
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
                var allSelections = Selections.find({poem_id: Session.get('currentPoem'), location: location}).fetch();
                _.each(allSelections, function(sel){
                  var piece = sel.style_id;  
                  var otherStyle = Styles.findOne({_id: piece});
                   if ((otherStyle !== undefined)){
                        if ((otherStyle.background_color !== undefined)){
                            console.log(otherStyle.layer_id);
                         op = Layers.findOne({id:otherStyle.layer_id}).opacity;
                         rgb = otherStyle.background_color;
                         var substring = rgb.substr(4);
                         substring = substring.slice(0, -1);
                         curRGBA = 'rgba('+substring+', ';
                        }
                   }
                });
               $("."+location).css(
                {
                    "background-color": curRGBA+op+")"
                }
               );
            }
            //if removed selection is bolding
            if ((style[0].font_color !== null)&&(typeof style[0].font_color !== "undefined")) {
                $("."+location).css(
                {
                    "color": "black"
                }
               );
            }
            //if removed selection is bolding
            if ((style[0].bold !== null)&&(typeof style[0].bold !== "undefined")) {
                $("."+location).css(
                {
                    "font-weight": "normal"
                }
               );
            }
            //if removed selection is stressing
            if((style[0].verticalAlign !== null)&&(typeof style[0].verticalAlign !== "undefined")){
                 location = location.substr(1);
                $('.'+location).css('vertical-align','baseline');
                $('.'+location).removeClass('stressStyle');
            }

          }
        }
        });
            //handles additions/removals from SyllableMarkers Collection
            var syllablesCursor = SyllableMarkers.find({poem_id:Session.get('currentPoem')});
            syllablesCursor.observe({
            added: function (selection, beforeIndex) {
            var location = selection.location;
            console.log($('#char138'));
            $("."+location).css(
            {
               "border-left": "3px solid red"
            });
            console.log($('#'+location));
             //or unknown line
            var lineSpan = $('#'+location).closest('.line');
            var countSpan = $(lineSpan).find('.lineCount');
            var wordCount=$(lineSpan).find('.word').length;
            var sylCount=0;
            $(lineSpan).find('.letter').each(function(){
                console.log($(this).css("border-left"));
            if ($(this).css("border-left-color")==="rgb(255, 0, 0)"){
                sylCount++; 
            }
            })
             $(countSpan).text(wordCount+sylCount);
            },
            removed: function (selection, beforeIndex) {
            var location = selection.location;
            $("."+location).css(
            {
               "border-left": "none"
            });
                //or unknown line
            var lineSpan = $('#'+location).closest('.line');
            var countSpan = $(lineSpan).find('.lineCount');
            var wordCount=$(lineSpan).find('.word').length;
            var sylCount=0;
            $(lineSpan).find('.letter').each(function(){
                console.log($(this).css("border-left"));
            if  ($(this).css("border-left-color")==="rgb(255, 0, 0)"){
                sylCount++; 
            }
            })
             $(countSpan).text(wordCount+sylCount);
            },
          });
        //handles additions/changes from Layers Collection
        var layersCursor = Layers.find({poem_id:Session.get('currentPoem')});
        layersCursor.observe({
        added: function(layer, beforeIndex){
            console.log(layer.type);
            if (layer.type == 'rhyme'){
            var layerID = (layer.id).trim();
            //automatically select default opacity; if no slight timeout, doesn't show
            //WHY ARE WE ADDING???
            setTimeout(function() {$("input:radio[name="+layerID+"]:nth(0)").attr('checked',true)}, 500);
            }
        },           
        //when opacity of layer is changed, all highlighting selections made by that layer must be changed
        changed: function (newLayer, oldLayer) {
            op = newLayer.opacity;
            console.log("layer changed");
            if ((op !== null)&&(typeof op !== "undefined")) {
              var allSelections = Selections.find({poem_id: Session.get('currentPoem'), layerNode_id: Session.get('curLayer')}).fetch();  
                _.each(allSelections, function(sel){
                    var thisID = sel.location;
                    console.log(thisID);
                    var thisStyleID = sel.style_id;
                    var thisStyle = Styles.findOne(thisStyleID);
                    var rgb = thisStyle.background_color;
                    var substring = rgb.substr(4);
                    substring = substring.slice(0, -1);
                    var curRGBA = 'rgba('+substring+', ';
                    console.log(curRGBA);          
                    $("."+thisID).css( 
                    {
                      "background": curRGBA+op+")"
                    }
                    );
                    });
            }
        } });

        };