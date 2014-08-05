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
    //gives user new shoutkey for same poem (that preserves annotations)
    'click .newShoutKey': function(event){
        //automatically remove existing shoutkey
        Meteor.clearTimeout(handleid);
        Shoutkeys.remove(shoutkeyID);
        var key = getRandomWord()
        Shoutkeys.insert({
            key:key,
            poem_id:Session.get('currentPoem'),
        });
        var $div = $('<div>'); 
        $div.attr('title', 'Launch');
        url = window.location.host + '/' + key;
        $div.html('Your exercise is at <br>' + url + '<br>');
        $div.dialog({
          resizable: false,
          height:250,
          width:500,
          modal: true,
          buttons: {
            "Go": function() {
              $( this).dialog('close');
               Router.go('/'+key, '_blank');
            },
            Cancel: function() {
              $( this ).dialog( "close" );
            }
          }
        })      
    },
//change how poem lines are displayed
'change .optionSelect':function(event){
    Session.set('breaksOption',$(event.currentTarget).val());
    //setTimeout(function() {syllableCounts()}, 1000);
}
});
  