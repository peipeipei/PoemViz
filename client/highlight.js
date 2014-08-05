//choose the color you want to highlight or bold with
chooseColor = function (thing){
    console.log(thing);
    console.log($(thing).closest('.layer'));
    var layerName = $(thing).closest('.layer').attr('id');
     Session.set('curLayer', layerName);
   if (layerName.substr(0,5) == 'color'){
       Session.set('selectedType', 'rhyme');
   }
   if (layerName.substr(0,4) == 'bold'){
         Session.set('selectedType', 'bold');
   }
    if(Session.get('selectedType')=='rhyme'){
        Session.set('highlightColor',$(thing).data('color'));
        $('.colorSquare').each(function(){
            $(this).removeClass('selectedColorSquare');
        })
        $(thing).addClass('selectedColorSquare');
        console.log('insert');
        var curStyle=Styles.insert({poem_id: Session.get("currentPoem"), layer_id: Session.get('curLayer'), background_color: Session.get('highlightColor')});
        Session.set("curStyle", curStyle);
    }
    if (Session.get('selectedType')=='bold'){
        Session.set('boldColor',$(thing).data('color'));
        $('.colorSquare').each(function(){
            $(this).removeClass('selectedColorSquare');
        })
        $(thing).addClass('selectedColorSquare');
        var curStyle = Styles.insert({poem_id: Session.get("currentPoem"), layer_id: Session.get('curLayer'), font_color: Session.get('boldColor'), bold: true});
        Session.set("curStyle", curStyle);
    }
};

//how highlighting is stored/removed from Selections Collection
colorClick = function (thing){
    console.log('colorClick');
    var flag = true;
    var possibleSelections = Selections.find({poem_id: Session.get('currentPoem'), location: $(thing).attr('id')}).fetch();
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
        Selections.insert({poem_id: Session.get('currentPoem'), style_id: Session.get('curStyle'), location: $(thing).attr('id')});
        console.log("flag is true");
        var op = $('.opacity:checked').data("value");
        var opStyle = Styles.insert({poem_id: Session.get('currentPoem'), layer_id: Session.get('curLayer'), opacity: op});
        Selections.insert({poem_id: Session.get('currentPoem'), style_id: opStyle, location: Session.get('curLayer').slice(-1)});
    }else{
       var idR = Selections.find({poem_id: Session.get('currentPoem'), location: $(thing).attr('id')}).fetch();
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
};

//Template.poem.colorOptions = function () { 
//    
//    // NEW STUFF        
//        var poemID = Session.get('currentPoem');
//        var colorIndex = ColorIndices.find({poem_id: poemID}).index;   
////        return Colors.find({layer_id:})
//        console.log("color options index: " + colorIndex);
//        
//        
//  };

//contains all the events that happen on the poem page
Template.poem.events({
    //adds a highlight color to the available colors
    'click .addColor': function(event){
//        var colorSquare=$('<span class="colorSquare"></span>');
//        var rightlightColors=$($(event.target).parent()).find('.highlightColors');
//        var ccount=rightlightColors.find('.colorSquare').length;
//        colorSquare.data('color', colors[ccount]);
//        colorSquare.css('background-color', colors[ccount]);
//        var a = $('<div class="colorBlock">').append(colorSquare);
//        var b = a.append($('<span class="colorName" contenteditable=true >Color Label</span></div>'));
//        rightlightColors.append(b);
//        // rightlightColors.append(colorSquare);
//        if(ccount>=colors.length-1){
//            $(event.target).css('display','none');
//        }
        // NEW STUFF
        var poemID = Session.get('currentPoem');
        console.log("poem id: " + poemID);
        var layerIDHTML = Session.get('curLayer');
        console.log("layerID in html:" + layerIDHTML);
        var layerID = Layers.findOne({id:layerIDHTML})._id;
        console.log("layer id: " + layerID);
        var colorIndex = ColorIndices.findOne({poem_id: poemID}).index;
        console.log("Color Index: " + colorIndex);
        Colors.insert({
             poem_id:poemID,
             layer_id: layerID,
             color_value: colors[colorIndex], 
             name: 'color label'
        })
        var newColorIndex = colorIndex + 1;
        console.log("new color index: " + newColorIndex);
        var colorIndexID = ColorIndices.findOne({poem_id: poemID})._id;
        ColorIndices.update(colorIndexID, {$set: {index: newColorIndex}});
        
    },
    //updates highlighting/bolding color when user clicks a square
    'click .colorSquare':function(event){
        console.log(event.currentTarget);
        chooseColor(event.currentTarget);
        console.log("hi");
    },
    //when you change the dropdown menu in a color layer, it updates highlightElement
    'change .rhymeSelect':function(event){
        Session.set('highlightElement',$(event.currentTarget).val());
    },
    //when user clicks an opacity option, change the opacity of all lines/words/characters colored/bolded by certain layer
      'change .opacity': function(event){
        var op = $(event.currentTarget).data("value");
        console.log(op);
        curStyle = Styles.insert({poem_id: Session.get('currentPoem'), layer_id: Session.get('curLayer'), opacity: op});
        Session.set('curStyle', curStyle);
        Selections.insert({poem_id: Session.get('currentPoem'), style_id: Session.get('curStyle'), location: Session.get('curLayer').slice(-1)});
      },
     //create new layer that allows highlighting
    'click .newColorLayer':function(event){
        var name = $(event.currentTarget).text();
        var count=Layers.find({poem_id: Session.get('currentPoem'), type:'rhyme'}).fetch().length;
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
    }
});
