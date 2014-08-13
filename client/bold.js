//how bolding is stored/removed from Selections Collection
//called when line, word, letter clicked
boldClick = function(thing){
        console.log('boldClick');
        var flag = true;
        var possibleSelections = Selections.find({poem_id: Session.get('currentPoem'), location: $(thing).attr('id')}).fetch();
        console.log("possible selections:");
        console.log(possibleSelections);
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
        Selections.insert({poem_id: Session.get('currentPoem'), style_id: Session.get('curStyle'), location: $(thing).attr('id'), layerNode_id: Session.get('curLayer')});
    }else{
       var selID = Selections.findOne({poem_id: Session.get('currentPoem'), location: $(thing).attr('id'), layerNode_id: Session.get('curLayer')})._id;
        Selections.remove(selID);
    }
}

Template.poem.events({
    //same as click .addColor, but for the bold layer
    //calls addColor
    'click .addBoldColor': function(event){
        var poemID = Session.get('currentPoem');
        var layerIDHTML = $(event.currentTarget).closest('.layer').attr('id')
        var layerID = Layers.findOne({id: layerIDHTML})._id;
        Session.set('selectedType', 'bold');
        var newStyleID = addColor(layerID);
        Session.set('curStyle', newStyleID)
    },
    //same as rhymeSelect, but for bold
    'change .boldSelect':function(event){
        Session.set('boldElement',$(event.currentTarget).val());
    },
     //create new layer that allows bolding
    'click .newBoldLayer':function(event){
        var name = $(event.currentTarget).text();
        var count=Layers.find({poem_id: Session.get('currentPoem'), type:'bold'}).fetch().length;
        if (name == "Other Bolding"){
            name='Click to name this layer!';
        }
        var divLayerID = 'bold' + count;
        var layerID = Layers.insert({
          name:name,
          id:divLayerID,
          poem_id:Session.get('currentPoem'),
          type:'bold',
          layerArray: darkColors,
      })
        // starts the "sound" layer with two default colors
        Colors.insert({
             poem_id:Session.get('currentPoem'),
             layer_id: layerID,
             color_value: darkColors[0], 
             name: 'Editable Color Label'
        })
        Colors.insert({
             poem_id:Session.get('currentPoem'),
             layer_id: layerID,
             color_value: darkColors[1], 
             name: 'Editable Color Label'
        })
        
        // NOTE: Index only starts at two because two colors have already been assigned to the 'Sound' layer
        ColorIndices.insert({
            poem_id:Session.get('currentPoem'),
            index: 2,
            layer: layerID
        });
        var newStyle = Styles.insert({poem_id: Session.get('currentPoem'), layer_id: divLayerID, font_color: darkColors[0], bold: true});    
        Styles.insert({poem_id: Session.get('currentPoem'), layer_id: divLayerID,  font_color: darkColors[1], bold: true});
        
        Session.set("curLayer", divLayerID);  
        Session.set('boldElement','boldLine');
        Session.set('selectedType','bold');
        Session.set('curStyle', newStyle)   
    }
});