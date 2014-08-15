
Template.poem.events({
    'click .layer': function(event){
        //will call template action
        Session.set("curLayer", $(event.currentTarget).attr('id'));
    },
    //pop-up instructions
    'click #questionMarkButton': function(event){
        console.log('yo');
        var $div = $('<div>'); 
        $div.attr('title', 'How to PoemViz');
        $div.html('<b> To highlight text: </b> <br> Click on the layer (one of the boxes in the rightmost column) with colored squares stacked vertically. Click on the color you would like to use and then click on the line you would like to highlight. If you would rather highlight words or letters, select those options from the drop-down menu. If none of the colors appeal to you, click on the \"+\" button for more complimentary colors. If this particular color scheme isn\'t really your thing (or you need more colors), click the \"Add a Layer\" button at the bottom, select \"Other Coloring\", and a new layer with new colors will be available for highlighting. You can also label these color layers and the colors they contain by clicking on their current labels. <br> <br> <b> To mark syllables: </b> <br> Click on the layer with label \"Syllable\". Move your cursor close to the letter you wish to insert a syllable mark before, and a temporary ghost marker will help you place the cursor in the correct place. Click, and a black line will be inserted. To remove the syllable marker, click in the same place again. You may toggle the visibility of all syllables on and off, clear all of the marks, and display the syllables in a grid with cells of equal width. <br> <br> <b> To make stress marks: </b> <br> Click on the layer with label \"Meter\". Click on any letter in the syllable you would like to be stressed, and that syllable will be raised higher than the surrounding syllables. To remove the stress, click in the same place again. You may toggle the visibility of all of the stress marks on and off and clear all of the stress marks. <br> <br> <b> To make layers visible, dim, or invisible: </b> Click either on the checkmark in the box or the dropdown (the triangle) to the right of the checkmark. Warning: these visibility settings (which are unique for each person viewing the poem) are not saved when the page is refreshed or closed. <br> <br> <b> To view the poem with no words: </b> <br> Click on the layer with label \"Text Options\". Click the \"Turn Text\" button to toggle the non-bolded poem text on and off. <br> <br> <b> To view the poem with different line breaks: </b> <br> Click on the layer with label \"Text Options\". Select what you would like to determine line breaks in the poem. Only the original view is editable, but all markings on the original view will be preserved in the other views. <br> <br> <b> To bold text: </b> <br> Click the \"Add a Layer\" button at the bottom, select \"Other Bolding\", and a new layer with new colors will be available for bolding. Bold just as you would highlight. <br> <br> <b> To share with friends: </b> <br> Give them the shortened url at the top of the page. The poem will be available at this url for only an hour, but it will permanently be available at the weird address with lots of letters and numbers in the url. <br> <br> <b> To fix any bugs you may encounter: </b> <br> Refresh the page! <br> <br> <b> To be awesome: </b> <br> Get started! :) ');
        $div.dialog({
          resizable: false,
          height:750,
          width:750,
          modal: true,
        })
    },

    'click #nextPoemSection':function(event){     
        var poemID = Session.get('currentPoem');
        var poemGroupID = Poems.findOne({_id: poemID}).poemGroup;
        var poemsArray = PoemGroups.findOne({_id: poemGroupID}).poems;
        var nextPoemIndex = poemsArray.indexOf(poemID) + 1;
        console.log(nextPoemIndex-1);
        console.log(nextPoemIndex);
        if (nextPoemIndex >= poemsArray.length) return;
        var nextPoemID = poemsArray[nextPoemIndex];
        Router.go('/poem/' + nextPoemID);
        
    },
    'click #previousPoemSection':function(event){
        var poemID = Session.get('currentPoem');
        var poemGroupID = Poems.findOne({_id: poemID}).poemGroup;
        var poemsArray = PoemGroups.findOne({_id: poemGroupID}).poems;
        var previousPoemIndex = poemsArray.indexOf(poemID) - 1;
        console.log(previousPoemIndex+1);
        console.log(previousPoemIndex);
        if (previousPoemIndex < 0) return;
        var previousPoemID = poemsArray[previousPoemIndex];
        Router.go('/poem/' + previousPoemID);
    },
    
    //don't let layers have multiple line names 
     'keydown .layerName': function(event)
    {
        //enter is key 13
        if(event.which == 13){
            event.preventDefault();
            var layerID=$(event.currentTarget).parent().attr('id');
            var curL_id=Layers.findOne({poem_id: Session.get('currentPoem'), id:layerID})._id;
            var newName=$(event.currentTarget).text();
            console.log("newName:",newName)
            Layers.update(curL_id, {$set: {name: newName}});
            $(event.currentTarget).blur()
        }
    },   

    //how to store user input for layer names and sync across users
    'blur .layerName':function(event){
        var layerID=$(event.currentTarget).parent().attr('id');
        var curL_id=Layers.findOne({poem_id: Session.get('currentPoem'), id:layerID})._id;
        var newName=$(event.currentTarget).text();
        console.log("newName:",newName)
        Layers.update(curL_id, {$set: {name: newName}});
    },
    
    //how to store user input for color names and sync across users
     'blur .colorName': function(event){
        var layerNodeID = Session.get('curLayer');
        var curL_id=Layers.findOne({poem_id: Session.get('currentPoem'), id:layerNodeID})._id;
        var colorsquare = $(event.currentTarget).prev('.colorSquare');
        var curColor = $(colorsquare).css("backgroundColor").trim();
        var substring = curColor.substr(4);
        substring = substring.slice(0, -1);
        var curRGBA = 'rgba('+substring+', 1)';
        curRGBA = curRGBA.split(' ').join('');
        var colorID = Colors.findOne({poem_id: Session.get('currentPoem'), layer_id: curL_id, color_value: curRGBA})._id;
        var newName=$(event.currentTarget).text();
        Colors.update(colorID, {$set: {name: newName}});    
    },
    
    //when user clicks a line and the line mode of highlighting or bolding is selected 
    'click .line':function(event){
        if(Session.get('selectedType')=='rhyme' && Session.get('highlightElement')=='line'){
            colorClick(event.currentTarget);
          }
          if(Session.get('selectedType')=='bold' && Session.get('boldElement')=='boldLine'){
            boldClick(event.currentTarget);
        }
    },
    
    //when user clicks a word and the word mode of highlighting or bolding is selected 
    'click .word':function(event){
        if(Session.get('selectedType')=='rhyme' && Session.get('highlightElement')=='word'){
            colorClick(event.currentTarget);
        }
        if(Session.get('selectedType')=='bold' && Session.get('boldElement')=='boldWord'){
            boldClick(event.currentTarget);
        }
    },
    
    //when user clicks a letter/space (character) and the "letter" mode of highlighting or bolding is selected 
    'click .letter, .space':function(event){
        if (Session.get('selectedType')=='syllable'){
            clickSyllable(event.currentTarget);
        }
        if(Session.get('selectedType')=='rhyme' && Session.get('highlightElement')=='letter'){
            colorClick(event.currentTarget);
          }
          if(Session.get('selectedType')=='bold' && Session.get('boldElement')=='boldLetter'){
            boldClick(event.currentTarget);
        }
        if (Session.get('selectedType')=='stressing'){
            stressClick(event.currentTarget);
        }
    },
    
//    scroll bar function
    'click .layers-menu':function(event){
        var scrolledPos = $("#layers").scrollTop();
        var parentPadding = $(".dropdown").parent().innerWidth() - $(this).parent().width();
        var parentHeight = $(".dropdown").parent().height() - parentPadding;
        $("#layers").animate({ scrollTop: scrolledPos + parentHeight}, "fast");
    
    }
});

//when the session variable for the syllables layer is "visible"
syllablesOn = function() {
    $('.syllable').css('min-width', '65px');
    $('.letter, .space').each(function(){
    //must make sure we give this data attribute to other users
    if ($(this).hasClass('syllableStyle')){
        console.log('syllable');
        $(this).css('border-left', '2px solid black');
    }
    });
    $('.lineCount').css('opacity','1.0');
    $('.syllableCount').css('color','blue')
}

//when the session variable for the syllables layer is "invisible"
syllablesOff = function() {
    Session.set('syllablesVisible', 'false');
    $('.syllableCount').css('color','white')
    $('.syllable').css('min-width', '0px');
    $('.letter, .space').each(function(){
        $(this).css('border-left', 'none');
    });
    $('.lineCount').css('opacity','0.0');
}

//when the session variable for the stress layer is "visible"
stressOn = function(){
    $('.letter, .word').each(function(){
    //must make sure we give this data attribute to other users
    if ($(this).hasClass('stressStyle') === true){
        $(this).css('vertical-align', 'super');
    }
    });  
};

//when the session variable for the stress layer is "invisible"
stressOff = function(){
    $('.letter, .word').each(function(){
    $(this).css('vertical-align', 'baseline');
    });  
};



