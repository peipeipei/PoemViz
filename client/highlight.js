//finds the current style and sets the correct session variables
selectColor = function (colorId){
    console.log('SELECT COLOR');
    //not the dom id, the actual id
    var layerID = Colors.findOne(colorId).layer_id;
    var layerType = Layers.findOne(layerID).type;
    var layerName = Layers.findOne(layerID).id;
    Session.set('curLayer', layerName);
    Session.set('selectedType', layerType); 
    if(Session.get('selectedType')=='rhyme'){
        var color = Colors.findOne(colorId).color_value;
        Session.set('highlightColor', color);
        var curStyle = Styles.findOne({poem_id: Session.get("currentPoem"), layer_id: Session.get('curLayer'), background_color: Session.get('highlightColor')})._id;
        Session.set("curStyle", curStyle);
    }
    else if (Session.get('selectedType')=='bold'){
        var color = Colors.findOne(colorId).color_value;
        Session.set('boldColor', color);
        var curStyle = Styles.findOne({poem_id: Session.get("currentPoem"), layer_id: Session.get('curLayer'), font_color: Session.get('boldColor'), bold: true})._id;
        Session.set("curStyle", curStyle);
        }   
        else{
            var curStyle = Styles.findOne({poem_id: Session.get("currentPoem"), layer_id: Session.get('curLayer'), font_color: Session.get('boldColor'), bold: true})._id;
        Session.set("curStyle", curStyle);
    }
};

//how highlighting is stored/removed from Selections Collection
colorClick = function (thing){
    var flag = true;
    var possibleSelections = Selections.find({poem_id: Session.get('currentPoem'), location: $(thing).attr('id')}).fetch();
    console.log("possible selections:");
    console.log(possibleSelections);
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
        Selections.insert({poem_id: Session.get('currentPoem'), style_id: Session.get('curStyle'), location: $(thing).attr('id'), layerNode_id: Session.get('curLayer')});
    }else{
       var selID = Selections.findOne({poem_id: Session.get('currentPoem'), location: $(thing).attr('id'), layerNode_id: Session.get('curLayer')})._id;
        Selections.remove(selID);
    }
};

//same for highlighting and bolding
//called when addColor/addBoldColor button clicked
addColor = function(layerID) {
    //find the next available colorIndex for this layer.
    //insert a new style with that color
    //increment the colorIndex
    
    var poemID = Session.get('currentPoem');
    var layerName = Layers.findOne(layerID).id
    var layerArray = Layers.findOne(layerID).layerArray; 
    var layerType = Layers.findOne(layerID).type; 
    
    var colorIndex = ColorIndices.findOne({poem_id: poemID, layer:layerID}).index;
    if (colorIndex < layerArray.length){
    var colorValue = layerArray[colorIndex]
    var newColorId = Colors.insert({
         poem_id:poemID,
         layer_id: layerID,
         color_value: colorValue, 
         name: 'Editable Color Label'
    })
    var newColorIndex = parseInt(colorIndex) + 1;
    var colorIndexID = ColorIndices.findOne({poem_id: poemID, layer:layerID})._id;
    ColorIndices.update(colorIndexID, {$set: {index: newColorIndex}});   
    
    if (layerType == 'rhyme'){
        var curStyle = Styles.insert({poem_id: poemID, layer_id: layerName, background_color: colorValue});
        Session.set('selectedType','rhyme');
    }
    else{
        var curStyle = Styles.insert({poem_id: poemID, layer_id: layerName, font_color: colorValue, bold: true}); 
        Session.set('selectedType','bold');
    }   
    return curStyle; 
    }
};

initializeColors = function(layerId){
    var newStyleId1 = addColor(layerId)
    var newStyleId2 = addColor(layerId)
    Session.set('curStyle', newStyleId1)   
};


Template.poem.events({
    //adds a highlight color to the available colors
    'click .addColor': function(event){
        var poemID = Session.get('currentPoem');
        var layerIDHTML = $(event.currentTarget).closest('.layer').attr('id')
        var layerID = Layers.findOne({id: layerIDHTML})._id;
        Session.set('selectedType', 'rhyme');
        var newStyleID = addColor(layerID);
        Session.set('curStyle', newStyleID) 
    },
    //updates highlighting/bolding color when user clicks a square
    'click .colorSquare':function(event){
        color = $(event.currentTarget).css('background-color'); 
        selectColor($(event.currentTarget).attr('id'));
        
    },
    //when you change the dropdown menu in a color layer, it updates highlightElement
    'change .rhymeSelect':function(event){
        Session.set('highlightElement',$(event.currentTarget).val());
    },
    //when user clicks an opacity option, change the opacity of all lines/words/characters colored/bolded by certain layer
      'change .opacity': function(event){
        var layerName = $(event.currentTarget).closest('.layer').attr('id');
        Session.set('curLayer', layerName);
        var op = $(event.currentTarget).data("value");
        var layerID = Layers.findOne({id: $(event.currentTarget).attr("name")})._id;
        Layers.update(layerID, {$set:{opacity: op}});
      },
     //create new layer that allows highlighting
    'click .newColorLayer':function(event){
        console.log("new color layer created");
        var name = $(event.currentTarget).text();
        var count=Layers.find({poem_id: Session.get('currentPoem'), type:'rhyme'}).fetch().length;
        if (name == "Other Coloring"){
            name='Click to name this layer!';
        }
       var divLayerID = 'color' + count;
       switch (count){
               case 1: var array = colorsSciFiDream;
               break;
               case 2: var array = colorsPastelOcean;
               break;
               case 3: var array = colorsSailboat;
               break;
               case 4: var array = colorsSorbet;
               break;
               default: var array = colorsGeneral;
               break;
       }
       var poemID = Session.get('currentPoem');
       var layerID = Layers.insert({
          name:name,
          id:divLayerID,
          poem_id:poemID,
          type:'rhyme',
          opacity: 1,
          layerArray: array
      });
        ColorIndices.insert({
            poem_id: poemID,
            index: 0,
            layer: layerID
        });
        Session.set("curLayer", divLayerID); 
        Session.set('highlightElement','line');

        initializeColors(layerID);
    }  
});
