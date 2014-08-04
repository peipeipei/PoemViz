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
}

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
        Selections.insert({poem_id: Session.get('currentPoem'), style_id: Session.get('curStyle'), location: $(thing).attr('id'), layerNode_id: Session.get('curLayer')});
        console.log("flag is true");
    }else{
       var selID = Selections.findOne({poem_id: Session.get('currentPoem'), location: $(thing).attr('id'), layerNode_id: Session.get('curLayer')})._id;
        Selections.remove(selID);
    }
}

//contains all the events that happen on the poem page
Template.poem.events({
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
          opacity: 1,
      })
       Session.set("curLayer", divLayerID);
       Session.set('highlightElement','line');
    }
});
