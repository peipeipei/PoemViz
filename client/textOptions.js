//contains all the events that happen on the poem page
Template.poem.events({
       //function of "Text Options" ('typing') layer
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
    
//change how poem lines are displayed
'change .optionSelect':function(event){
    Session.set('breaksOption',$(event.currentTarget).val());
    //setTimeout(function() {syllableCounts()}, 1000);
}
});
  
  /*//in "Text Options" ('typing') layer, allow user to seperate poem by punctuation marks
'click .puncOption': function(event){
    //RIGHT NOW, makes new line/word/character spans (but she doesn't want this)
    //instead, make such that line/word/letter spans are maintained, only new line breaks are made
    
    //used to make id's for lines, words, characters
    var lCounter=0,
        wCounter=0,
        cCounter=0;
    if($('.puncOption').data('active')){
            //what should happen when user has already clicked the button
        }else{
 }} });*/