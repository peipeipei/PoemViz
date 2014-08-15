Template.poem.events({
  //function of "Text Options" ('typing') layer
  'click .wordOption': function(event){
    if($('.wordOption').data('active')){
           $('.unnaturalLine, .line, .word, .letter').each(function() {
               if ($(this).hasClass('noStyling')){
                    $(this).removeAttr("style"); 
                    $(this).removeClass('noStyling');
               }
               else{
               var letterColor = $(this).css('color').trim();
                console.log(letterColor);
               if (letterColor.substring(0,4) == "rgb("){
               var n = letterColor.indexOf(")");
               var rgba = "rgba"+letterColor.substr(3,n-3);
               var transparentColor = rgba +', 1)';
               console.log(transparentColor);
               $(this).css('color', transparentColor);
               }
                else{
                    var lastIndex = letterColor.lastIndexOf(",");
                    var substring = letterColor.substr(0, lastIndex+1);
                    var curRGBA = substring+' ';
                    var transparentColor = curRGBA+"1"+")";
                    console.log(transparentColor);
                    $(this).css('color', transparentColor);
                }
               }           
           });
            $('.wordOption').text('Turn Text Off');
            $('.wordOption').data('active', false);
        }else{
            $(' .unnaturalLine, .line, .word, .letter').each(function() {
                if ($(this).attr('style') != undefined){
               var letterColor = $(this).css('color').trim();
                console.log(letterColor);
               if (letterColor.substring(0,4) == "rgb("){
               var n = letterColor.indexOf(")");
               var rgba = "rgba"+letterColor.substr(3,n-3);
               var transparentColor = rgba +', 0)';
               console.log(transparentColor);
               $(this).css('color', transparentColor);
               }
                else{
                    var lastIndex = letterColor.lastIndexOf(",");
                    var substring = letterColor.substr(0, lastIndex+1);
                    var curRGBA = substring+' ';
                    var transparentColor = curRGBA+"0"+")";
                    console.log(transparentColor);
                    $(this).css('color', transparentColor);
                }
                }
                else{
                  $(this).css('color', 'rgba(0,0,0,0)'); 
                  $(this).addClass("noStyling");
                }       
           });
            $('.wordOption').text('Turn Text On');
            $('.wordOption').data('active', true);
        }
    },
    //gives user new shoutkey for same poem (that preserves annotations)
    'click .newShoutKey': function(event){
        //automatically remove existing shoutkey
        Meteor.clearTimeout(handleid);
        Shoutkeys.remove(shoutkeyID);
        var key = getRandomWord();
        var curPoem = Session.get('currentPoem');
        var curPoemIndex = Poems.findOne({_id: curPoem}).poemGroupIndex;
        var curPoemGroup = Poems.findOne({_id: curPoem}).poemGroup;
        Shoutkeys.insert({
            key:key,
            index: curPoemIndex,
            poem_id: curPoem,
            poem_group_id: curPoemGroup
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
//'display': 'none' makes divs take up no space
'change .optionSelect':function(event){
    var pastConfig = Session.get('breaksOption');
    Session.set('breaksOption',$(event.currentTarget).val());
    if (Session.get('breaksOption') == 'origOption'){
        $('#origOption').css('display','inline');
        $('#puncOption').css('display','none');
        $('#sentOption').css('display','none');
        $('#addLayer').css('visibility','visible');
        $('.layer').css('display','block');
    }
    if (Session.get('breaksOption') == 'puncOption'){
        $('#origOption').css('display','none');
        $('#puncOption').css('display','inline');
        $('#sentOption').css('display','none');
        $('.layer').css('display','none');
        $('#addLayer').css('visibility','hidden');
        $('#typing0').css('display','block');
        if (pastConfig == 'origOption'){
            $("#layers").animate({ scrollTop: 0}, "fast");
        }
        $('.optionSelect').val(Session.get('breaksOption'));
    }
    if (Session.get('breaksOption') == 'sentOption'){
        $('#origOption').css('display','none');
        $('#puncOption').css('display','none');
        $('#sentOption').css('display','inline');
        $('.layer').css('display','none');
        $('#addLayer').css('visibility','hidden');
        $('#typing0').css('display','block');
        if (pastConfig == 'origOption'){
            $("#layers").animate({ scrollTop: 0}, "fast");
        }
        $('.optionSelect').val(Session.get('breaksOption'));
    }
}    
});

  