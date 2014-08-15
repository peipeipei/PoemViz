//five aethestically pleasing sets of colors to use (six colors in each)
colorsSailboat =["rgba(255,175,110,1)","rgba(187,115,101,1)","rgba(222,173,161,1)","rgba(255,255,204,1)","rgba(153,230,255,1)","'rgba(200,223,226,1)'"];
colorsRainbow = ['rgba(241,103,69,1)', 'rgba(255,198,93,1)','rgba(123,200,164,1)','rgba(76,195,217,1)','rgba(147,100,141,1)','rgba(190,190,190,1)'];
colorsPastelOcean = ['rgba(190,214,97,1)','rgba(137,232,148,1)','rgba(120,213,227,1)','rgba(122,245,245,1)','rgba(52,221,221,1)','rgba(147,226,213,1)'];
colorsSciFiDream = ['rgba(209,232,238,1)', 'rgba(246,231,245,1)', 'rgba(255,211,224,1)', 'rgba(254,250,246,1)', 'rgba(214,223,226,1)', 'rgba(185,202,143,1)'];
colorsSorbet = ['rgba(222,84,139,1)','rgba(222,138,171,1)','rgba(222,197,207,1)','rgba(240,197,170,1)','rgba(218,222,209,1)','rgba(118,222,182,1)'];      
//and a random one to keep cycling through as long as users continue to add layers (the old default)
colorsGeneral = ['rgba(255,153,153,1)','rgba(255,153,255,1)','rgba(221,153,255,1)','rgba(170,153,255,1)', "rgba(153,204,255,1)",'rgba(153,255,255,1)', 'rgba(153, 255, 170,1)','rgba(204,255,153,1)', 'rgba(255,255,153,1)', 'rgba(255,204,153,1)'];

//default colors for bolding (bolding layers)
darkColors=['rgba(0,0,0,1)','rgba(0,102,51,1)','rgba(0,0,153,1)','rgba(85,0,102,1)','rgba(102,0,34,1)'];

//defaults
Session.set('highlightElement','line');
Session.set('boldElement','boldLine');

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

Handlebars.registerHelper("equals", function (a, b) {
  return (a == b);
});

//when uncommented, nullifies all console.log's by redefining the function itself
console.log = function() {}

//makes sure that all your collections are ready before loading the page
checkIsReady = function(){
    return true;
}

Template.poem.isReady=function(){
    return true;
    return checkIsReady();
}

Template.poem.previousVisible=function(){
    var poem_id = Session.get('currentPoem');
    var poem_group_index = Poems.findOne({_id:poem_id}).poemGroupIndex;
    console.log("LOOK AT ME!");
    console.log(poem_group_index !=1);
    return poem_group_index !=1;
}

Template.poem.nextVisible=function(){
    var poem_id = Session.get('currentPoem');
    var poem_group = Poems.findOne({_id:poem_id}).poemGroup;
    var poem_group_index = Poems.findOne({_id:poem_id}).poemGroupIndex;
    console.log("LOOK AT ME!");
    return (poem_group_index < PoemGroups.findOne({_id:poem_group}).poems.length);
}

//returns all the layers in the database
//called whenever layer is changed
//populates 'layer' in html
Template.layers.layer=function(){
    // array of all the current layers the poem has
    var poemLayers = Layers.find({poem_id:Session.get('currentPoem')}).fetch();
    // for any layers with color options, display the color choices
    // i is a layer
    _.each(poemLayers, function(i){
        if (i.type == "rhyme") {
            var layerID = i._id;
            var layerColors = Colors.find({layer_id:layerID}).fetch();
            i['colorOptions'] = layerColors
            
        }
        if (i.type == "bold") {
            var layerID = i._id;
            var layerColors = Colors.find({layer_id:layerID}).fetch();
            i['colorOptions'] = layerColors   
        }
    })
    return poemLayers;
}

Template.layers.rendered = function(){
    console.log("LAYERS RENDERED")   
}


Template.poem.events({
    //adds a highlight color to the available colors
    'click .layer': function(event){
        var layerID = Layers.findOne({id: $(event.currentTarget).attr('id')})._id;
       /* if (sessionObj[layerID] != "dimmed"){
        sessionObj[layerID] = "visible";
        Session.set("layersArray", sessionObj);
        }*/
        selectLayer(layerID);
    }
    
});

//called whenever Session.get('curLayer') is changed
Template.layers.isSelectedLayer = function() {
    console.log(this.id);
    //now we can do this (when adding a layer)
    //in added part of layer cursor functions, dom isn't rendered yet
    updateCheckBoxes();
    if (this.id == Session.get('curLayer')){
        console.log("this is selected");
        return "selectedLayer";
    }
    else{
        return "";
    }   
}

//called whenever Session.get('curLayer') is changed
Template.layers.moreColors = function() {
    if (Session.get('curLayer') != undefined && Layers.findOne({id: Session.get('curLayer')}) != undefined){
        var layerArray = Layers.findOne({id: Session.get('curLayer')}).layerArray;
        var layerID = Layers.findOne({id: Session.get('curLayer')})._id;
        if (ColorIndices.findOne({layer: layerID}) != undefined){
            var colorPointer = ColorIndices.findOne({layer: layerID}).index;
            console.log(layerArray.length, colorPointer);
            if (layerArray.length > colorPointer){
                return true;
            }
            else{
                return false;
            } 
        }
    }
}

//called whenever Session.get('curStyle') is changed
Template.layers.isColorSquareSelected = function(){
    var colorValue = this.color_value    
    var curStyleID = Session.get('curStyle')
    if(curStyleID != undefined){
        if (colorValue == Styles.findOne(curStyleID).background_color || colorValue == Styles.findOne(curStyleID).font_color){
            return "selectedColorSquare"
        }
        else{
            return ""
        }
    }
    else{
        return ""   
    }
}

//called when a layer is clicked
//sets default color if necessary
selectLayer = function(layerID) {
    var layerName = Layers.findOne(layerID).id
    var clickedLayer = $('#' + layerName);
    var sessionObj = Session.get("layersArray");
    Session.set('curLayer', layerName);
    Session.set('selectedType',Layers.findOne(layerID).type);

    if (Session.get('selectedType')=='bold'){
        //make sure user selects element as indicated by the dropdown
        var dropdown = $(clickedLayer).find('.boldSelect:first');
        Session.set('boldElement', $(dropdown).val());
        if (Session.get('curStyle') == undefined){
           Session.set('curStyle', Styles.findOne({layer_id: layerName})._id); 
        }
        else{
        var styleNodeLayer = Styles.findOne(Session.get('curStyle')).layer_id;
        var styleLayer = Layers.findOne({id: styleNodeLayer})._id;
        if (styleLayer !== layerID){
            Session.set('curStyle', Styles.findOne({layer_id: layerName})._id);
         }
        }
    }
    else if (Session.get('selectedType')=='rhyme'){
        //make sure user selects element as indicated by the dropdown
        var dropdown = $(clickedLayer).find('.rhymeSelect:first');       
        Session.set('highlightElement', $(dropdown).val());   
        if (Session.get('curStyle') == undefined){
           Session.set('curStyle', Styles.findOne({layer_id: layerName})._id); 
        }
        else{
        var styleNodeLayer = Styles.findOne(Session.get('curStyle')).layer_id;
        var styleLayer = Layers.findOne({id: styleNodeLayer})._id;
        if (styleLayer !== layerID){
            Session.set('curStyle', Styles.findOne({layer_id: layerName})._id);
         }
        }
    }
    else {
        Session.set('curStyle', undefined);
    }
}

//finds the next recently added color selection of a location when the most recently added selection is hidden
setNextBackgroundColor = function(location){
        var curRGBA = "transparent";
        var allSelections = Selections.find({poem_id: Session.get('currentPoem'), location: location}).fetch();
       //will update color to next most recently added selection
        _.each(allSelections, function(sel){
          var piece = sel.style_id;  
          var otherStyle = Styles.findOne({_id: piece});
          if ((otherStyle !== undefined)){
                if ((otherStyle.background_color !== undefined)){
                     var layerSelection = Layers.findOne({id:otherStyle.layer_id})._id;
                     var visibilityofLayer = (Session.get("layersArray"))[layerSelection];
                     switch (visibilityofLayer){
                             case "visible":
                             var op = 1;
                             break;
                             case "dimmed":
                             var op = 0.3;
                             break;
                             case "invisible":
                             var op = 0;
                             break;
                             default:
                             console.log('oops, missed a case');
                     }
                    var rgba = otherStyle.background_color;
                    var lastIndex = rgba.lastIndexOf(",");
                    var substring = rgba.substr(0, lastIndex+1);
                    var newRGBA = substring+op+")";
                     if (op !== 0){
                         curRGBA = newRGBA;
                      }
                }
           }
        });

       $("."+location).css(
        {
            "background-color": curRGBA
        }
       );
}

//when visibility of color layer is changed, update all selections of that layer
colorSelOpacity = function(op, sel){
        var thisID = sel.location;
        if (op !== 0){
            var thisStyleID = sel.style_id;
            var thisStyle = Styles.findOne(thisStyleID);
            var rgba = thisStyle.background_color;
            var lastIndex = rgba.lastIndexOf(",");
            var substring = rgba.substr(0, lastIndex+1);
            //check opacity of layer that made the selection
            var curRGBA = substring+' ';
            var newRGBA = curRGBA+op+")";     
            console.log(newRGBA);
            $("."+thisID).css( 
            {
              "background": newRGBA
            }
            );
        }
        else{
            setNextBackgroundColor(thisID);
        }
};

//make look of checkboxes be determined by whether a layer is visible/dimmed/invisible
updateCheckBoxes = function(){
    var statuses = Session.get('layersArray');
    var layers = Layers.find().fetch();
    _.each(layers, function(layer){
        var status = statuses[layer._id];
        switch(status){
                case "visible":
                //console.log('#checkSquare'+layer._id, "VISIBLE")
                $('#checkSquare'+layer._id).text("✓");
                $('#checkSquare'+layer._id).css('color','red');
                break;
                case "dimmed":
                $('#checkSquare'+layer._id).text("✓");
                $('#checkSquare'+layer._id).css('color','gray');
                break;
                case "invisible":
                $('#checkSquare'+layer._id).text(" ");
                break;
                default:
                //oops
        }      
    });
    
};

//called whenever selection added, syllable marker added, or layer visibility changed in session variable "layersArray"
Deps.autorun(function(){
    var sessionObj = Session.get('layersArray') 
    var selections = Selections.find().fetch();
    updateCheckBoxes();
    _.each(selections, function(elem) {
        var layerNodeId = elem.layerNode_id;
        //console.log(layerNodeId);
        var layerId = Layers.findOne({id: layerNodeId})._id;
        var layerType = Layers.findOne(layerId).type;
        var status = sessionObj[layerId];
        var possibleBoldClasses = ['boldrgba(0,0,0,1)','boldrgba(0,102,51,1)','boldrgba(0,0,153,1)','boldrgba(85,0,102,1)','boldrgba(102,0,34,1)'];
        if (status == "visible"){
            switch(layerType) {
                case "rhyme":
                    colorSelOpacity(1, elem);
                    break;
                case "bold":
                    $('.'+elem.location).css('font-weight','bold');
                    _.each(possibleBoldClasses, function(cla) {
                    if ($('.'+elem.location).hasClass(cla)){
                        $('.'+elem.location).css('color',cla.substring(4));
                    }  
                    });
                    break;
                case "typing":
                    //shouldn't have visible/invisible capabilities
                    break;
                case "stressing":
                     //do nothing yet
                    break;
                default:
                    console.log('oops, missed a case');
            }       
        }
        else if (status == "dimmed"){
            switch(layerType) {
                case "rhyme":
                    colorSelOpacity(0.3, elem);
                    break;
                case "bold":
                    //shouldn't have ability to be dimmed
                    break;
                case "typing":
                    //shouldn't have visible/invisible capabilities
                    break;
                case "stressing":
                     //do nothing yet
                    break;
                default:
                    console.log('oops, missed a case');
        }       
        }
        else {
            switch(layerType) {
            case "rhyme":
                colorSelOpacity(0, elem);
                break;
            case "bold":
                 $('.'+elem.location).css('font-weight','normal');
                 $('.'+elem.location).css('color', 'black');
                break;
            case "typing":
                //shouldn't have visible/invisible capabilities
                break;
            case "stressing":
                //do nothing yet
                break;
            default:
                console.log('oops, missed a case');
        }  
        }
    });
    var sylLayer = Layers.findOne({id:"syllable0"});
    //not used directly, but we need to call deps.autorun when this collection changes
    var syllables = SyllableMarkers.find().fetch();
    if (sylLayer != undefined){
        if (sessionObj[sylLayer._id] == 'visible'){
            syllablesOn();
        }
        if (sessionObj[sylLayer._id] == 'invisible'){
            syllablesOff();
        }
    }
    var stressLayer = Layers.findOne({id:"stress0"});
    if (stressLayer != undefined){
        if (sessionObj[stressLayer._id] == 'visible'){
            stressOn();
        }
        if (sessionObj[stressLayer._id] == 'invisible'){
            stressOff();
        } 
    }
});

//auto-scrolls to newly created layer
function scrollForNewLayer(layerId){
    var targetLayer = $('#' + layerID);
    var scrolledPos = $("#layers").scrollTop();
    var layerPos = targetLayer.position().top;
    var layerHeight = targetLayer.height();
    var parentPadding = targetLayer.parent().innerWidth() - targetLayer.parent().width();
    var parentHeight = targetLayer.parent().height() - parentPadding;

    // if a layer is partially out of view from above, bring it down when you select it
    if (layerPos < 0){
        $("#layers").scrollTop(scrolledPos + layerPos);
    }
    // if a layer is partially out of view from below, bring it up when you select it
    else if (layerPos + layerHeight > parentHeight){
        $("#layers").scrollTop(scrolledPos + layerPos - parentHeight + layerHeight);
    }         
}

    
///////////////////////////
// Once the poem is rendered, run a query for all selections
// When a selection is added, update the HTML of the poem using
// the identifiers given for every line, word, etc.
///////////////////////////
 Template.poem.rendered=function(){
     //display current shoutkey information
     var curPoem = Session.get('currentPoem')
     shoutkeyKey = Shoutkeys.findOne({poem_id: curPoem}).key;
     shoutkeyIndex = Shoutkeys.findOne({poem_id: curPoem}).index;
     shoutkeyID = Shoutkeys.findOne({poem_id: curPoem})._id;
     $('#shoutkey').text("This poem can also be found for an hour at: poemviz.meteor.com/"+shoutkeyKey + '/' + shoutkeyIndex);
     //expire shoutkey after an hour
     handleid = Meteor.setTimeout(function() {Shoutkeys.remove(shoutkeyID); console.log('woohoo!');}, EXPIRATION_TIME);
     $('#origOption').css('display','inline');
     $('#puncOption').css('display','none');
     $('#sentOption').css('display','none');
     //set the tab name to that of the poem
     document.title = Poems.findOne(Session.get('currentPoem')).title;
     displaySelections();
     syllableCounts();
     
     //initialize default visibility of all layers
     var initialArray = {};
     var initialLayers = Layers.find().fetch();
     console.log(initialLayers);
     _.each(initialLayers, function(elem){
         initialArray[elem._id] = "visible";
         console.log(elem._id);
         console.log(initialArray[elem._id]);

     });
     Session.set("layersArray", initialArray);
 }
     
//what to do upon rendering of poem
function displaySelections(){
    //defaults
    Session.set('breaksOption','origOption');
    Session.set('highlightElement','line');
    Session.set('boldElement','boldLine');
    Session.set('syllablesVisible','true');
    Session.set('stressVisible', 'true');
    
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
            var layerID = Layers.findOne({poem_id: Session.get('currentPoem'), id: layerNodeID})._id;
            //if selection is from highlighting style/layer
            if ((style[0].background_color !== null)&&(typeof style[0].background_color !== "undefined")) {
               var rgba = style[0].background_color;
               var lastIndex = rgba.lastIndexOf(",");
               var substring = rgba.substr(0, lastIndex+1);
               //check opacity of layer that made the selection
               var curRGBA = substring+' ';
               var op = Layers.findOne(layerID).opacity;
               var newRGBA = curRGBA+op+")";
                console.log(newRGBA);
               $("."+location).css(
                {
                    "background": newRGBA
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
                $("."+location).addClass("bold"+style[0].font_color);
                }
            }
            //if selection is from stressing style/layer
            if((style[0].verticalAlign !== null)&&(typeof style[0].verticalAlign !== "undefined")){
                location = location.substr(1);
              if (Session.get('stressVisible')=="true"){
              $('.'+location).css('vertical-align','super');
              }
              $('.'+location).addClass('stressStyle');
            }
        }
      },
      //when something is removed from the Selections Collection
        removed: function (selection, beforeIndex) {
            var location = selection.location;
            var styleID = selection.style_id;
            var curLayerNodeID = selection.layerNode_id;
            var style = Styles.find({_id:styleID}).fetch();
            console.log(style);
            //used to catch errors
            if (style.length > 0){
                //if removed is highlighting
                if ((style[0].background_color !== undefined)) {
                    //must go through all selections that may have colored line/word/character to check and
                    //see if after one background-color is turned off, there is another (from another layer)
                    //still coloring that line/word/character
                    var curRGBA = "transparent";
                    var allSelections = Selections.find({poem_id: Session.get('currentPoem'), location: location}).fetch();
                    console.log(allSelections);
                    _.each(allSelections, function(sel){
                      var piece = sel.style_id;  
                      var otherStyle = Styles.findOne({_id: piece});
                       if ((otherStyle !== undefined)){
                            if ((otherStyle.background_color !== undefined)){
                                op = Layers.findOne({id:otherStyle.layer_id}).opacity;
                                var rgba = otherStyle.background_color;
                                var lastIndex = rgba.lastIndexOf(",");
                                var substring = rgba.substr(0, lastIndex+1);
                                //check opacity of layer that made the selection
                                curRGBA = substring;
                                var newRGBA = curRGBA+op+")";
                                 if (otherStyle.layer_id != curLayerNodeID){
                                     curRGBA = newRGBA;
                                     console.log(curRGBA);
                                  }
                            }
                       }
                    });
                    $("."+location).css(
                       {
                           "background-color": curRGBA
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
                    $("."+location).removeClass("bold"+style[0].font_color);
                }
                //if removed selection is bolding
                if ((style[0].bold !== null)&&(typeof style[0].bold !== "undefined")) {
                   //so that word can be bolded if line is bolded
                   $("."+location).css("font-weight","");
                   $("."+location).css("color","");
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
                if (Session.get('syllablesVisible')=="true"){
                    $("."+location).css(
                    {
                       "border-left": "2px solid black"
                    });
                }
                $("."+location).addClass('syllableStyle');
                //updates natural syllables
                var lineSpan = $('#'+location).closest('.line');
                var countSpan = $(lineSpan).find('.lineCount');
                var wordCount=$(lineSpan).find('.word').length;
                var sylCount=0;
                $(lineSpan).find('.letter').each(function(){
                    if ($(this).hasClass("syllableStyle")){
                        sylCount++; 
                    }
                })
                 $(countSpan).text(wordCount+sylCount);
                //updates other versions' syllable markers 
                var lineSpanArray = $('.'+location).closest('.unnaturalLine');
                var countSpan1 = $(lineSpanArray[0]).find('.lineCount');
                var countSpan2 = $(lineSpanArray[1]).find('.lineCount');
                var wordArray1=$(lineSpanArray[0]).find('.word');
                var wordArray2=$(lineSpanArray[1]).find('.word');
                var wordCount1 = 0;
                var wordCount2 = 0;
                //don't count the awkward spaces created by new lines
                _.each(wordArray1, function(elem) {
                    if ($(elem).text().trim() == ""){
                    }
                    else{
                      wordCount1++;
                    }
                });
                _.each(wordArray2, function(elem) {
                    if ($(elem).text().trim() == ""){
                    }
                    else{
                      wordCount2++;
                    }
                });
                var sylCount1=0;
                var sylCount2=0;   
                $(lineSpanArray[0]).find('.letter').each(function(){
                if ($(this).hasClass("syllableStyle")){
                    sylCount1++; 
                }
                });
                $(lineSpanArray[1]).find('.letter').each(function(){
                if ($(this).hasClass("syllableStyle")){
                    sylCount2++; 
                }
                });
                 $(countSpan1).text(wordCount1+sylCount1);
                 $(countSpan2).text(wordCount2+sylCount2);
                 if ($('.syllablesGrid').data('gridded')===true){
                     grid();
                     grid();
                 }
            },
            removed: function (selection, beforeIndex) {
                var location = selection.location;
                $("."+location).css(
                {
                   "border-left": "none"
                });
                $("."+location).removeClass('syllableStyle');
                var lineSpan = $('#'+location).closest('.line');
                var countSpan = $(lineSpan).find('.lineCount');
                var wordCount=$(lineSpan).find('.word').length;
                var sylCount=0;
                $(lineSpan).find('.letter').each(function(){
                    console.log($(this).css("border-left"));
                if  ($(this).hasClass("syllableStyle")){
                    sylCount++; 
                }
                })
                 $(countSpan).text(wordCount+sylCount);
                //updates other versions' syllable markers 
                var lineSpanArray = $('.'+location).closest('.unnaturalLine');
                var countSpan1 = $(lineSpanArray[0]).find('.lineCount');
                var countSpan2 = $(lineSpanArray[1]).find('.lineCount');
                var wordArray1=$(lineSpanArray[0]).find('.word');
                var wordArray2=$(lineSpanArray[1]).find('.word');
                var wordCount1 = 0;
                var wordCount2 = 0;
                //don't count the awkward spaces created by new lines
                _.each(wordArray1, function(elem) {
                    if ($(elem).text().trim() == ""){
                    }
                    else{
                      wordCount1++;
                    }
                });
                _.each(wordArray2, function(elem) {
                    if ($(elem).text().trim() == ""){
                    }
                    else{
                      wordCount2++;
                    }
                });
                var sylCount1=0;
                var sylCount2=0;   
                $(lineSpanArray[0]).find('.letter').each(function(){
                if ($(this).hasClass("syllableStyle")){
                    sylCount1++; 
                }
                });
                $(lineSpanArray[1]).find('.letter').each(function(){
                if ($(this).hasClass("syllableStyle")){
                    sylCount2++; 
                }
                });
                 $(countSpan1).text(wordCount1+sylCount1);
                 $(countSpan2).text(wordCount2+sylCount2);
                 if ($('.syllablesGrid').data('gridded')===true){
                     grid();
                     grid();
                 }
            },
    });
    //handles changes from Layers Collection
    var layersCursor = Layers.find({poem_id:Session.get('currentPoem')});
    layersCursor.observe({    
        added: function (selection, beforeIndex) {
            var sessionObj = Session.get("layersArray");
            //if layer just created, user probably wants to use it, so default "visible"
            sessionObj[selection._id] = "visible";
            Session.set("layersArray", sessionObj);
        },
    });

};
