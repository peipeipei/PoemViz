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
        var curPoem = Session.get('currentPoem')
        var curPoemIndex = Poems.findOne({_id: curPoem}).poemGroupIndex
        Shoutkeys.insert({
            key:key,
            index: curPoemIndex,
            poem_id: curPoem,
        });
        
        var $div = $('<div>'); 
        $div.attr('title', 'Launch');
        url = window.location.host + '/' + key + '/' + curPoemIndex;
        $div.html('Your exercise is at <br>' + url + '<br>');
        $div.dialog({
          resizable: false,
          height:250,
          width:500,
          modal: true,
          buttons: {
            "Go": function() {
              $( this).dialog('close');
               Router.go('/'+key+'/'+curPoemIndex, '_blank');
            },
            Cancel: function() {
              $( this ).dialog( "close" );
            }
          }
        })      
    },
//change how poem lines are displayed
'change .optionSelect':function(event){
    var pastConfig = Session.get('breaksOption');
    Session.set('breaksOption',$(event.currentTarget).val());
    if (Session.get('breaksOption') == 'origOption'){
        switching($('#'+pastConfig), $('#origOption'));
        $('#origOption').css('visibility','visible');
        $('#puncOption').css('visibility','hidden');
        $('#sentOption').css('visibility','hidden');
        $('#addLayer').css('visibility','visible');
        $('.layer').css('visibility','visible');
        switching($('#color0'), $('#typing0'));
    }
    if (Session.get('breaksOption') == 'puncOption'){
        switching($('#'+pastConfig), $('#puncOption'));
        $('#origOption').css('visibility','hidden');
        $('#puncOption').css('visibility','visible');
        $('#sentOption').css('visibility','hidden');
        $('.layer').css('visibility','hidden');
        $('#addLayer').css('visibility','hidden');
        $('#typing0').css('visibility','visible');
        if (pastConfig == 'origOption'){
        switching($('#color0'), $('#typing0'));
        $("#layers").animate({ scrollTop: 0}, "fast");
        }
        $('.optionSelect').val(Session.get('breaksOption'));
    }
    if (Session.get('breaksOption') == 'sentOption'){
        switching($('#'+pastConfig), $('#sentOption'));
        $('#origOption').css('visibility','hidden');
        $('#puncOption').css('visibility','hidden');
        $('#sentOption').css('visibility','visible');
        $('.layer').css('visibility','hidden');
        $('#addLayer').css('visibility','hidden');
        $('#typing0').css('visibility','visible');
        if (pastConfig == 'origOption'){
        switching($('#color0'), $('#typing0'));
        $("#layers").animate({ scrollTop: 0}, "fast");
        }
        $('.optionSelect').val(Session.get('breaksOption'));
    }
}    
});

switching = function(div1, div2){
                tdiv1 = div1.clone();
                tdiv2 = div2.clone(); 
                if(!div2.is(':empty')){
                     div1.replaceWith(tdiv2);
                      div2.replaceWith(tdiv1);
                 }               
}

  