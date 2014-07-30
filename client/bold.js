//how bolding is stored/removed from Selections Collection
boldClick = function(thing){
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

//contains all the events that happen on the poem page
Template.poem.events({
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
    //same as rhymeSelect, but for bold
    'change .boldSelect':function(event){
        Session.set('boldElement',$(event.currentTarget).val());
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
    }
});