//contains all the events that happen on the poem page
Template.poem.events({
       //function of "Text Options" ('typing') layer
  'click .wordOption': function(event){
    if($('.wordOption').data('active')){
           // $('#leftSide').css('color', 'rgba(0,0,0,1)');
           // $('.word').css('color', 'rgba(0,0,0,1)');
           $('.letter').each(function() {
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
                    
           });
            $('.wordOption').text('Turn Text Off');
            $('.wordOption').data('active', false);
        }else{
           // $('#leftSide').css('color', 'rgba(0,0,0,0)');
           // $('.word').css('color', 'rgba(0,0,0,0)');
            $('.letter').each(function() {
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
//        switching($('#'+pastConfig), $('#origOption'));
        
        $('#origOption').css('display','inline');
        $('#puncOption').css('display','none');
        $('#sentOption').css('display','none');
        
//       $('#origOption').css('visibility','visible');
//        $('#puncOption').css('visibility','hidden');
//        $('#sentOption').css('visibility','hidden');
        $('#addLayer').css('display','visible');
        $('.layer').css('display','block');
   //     switching($('#color0'), $('#typing0'));
    }
    if (Session.get('breaksOption') == 'puncOption'){
//        switching($('#'+pastConfig), $('#puncOption'));
        $('#origOption').css('display','none');
        $('#puncOption').css('display','inline');
        $('#sentOption').css('display','none');
//        
//        $('#origOption').css('visibility','hidden');
//        $('#puncOption').css('visibility','visible');
//        $('#sentOption').css('visibility','hidden');
        $('.layer').css('display','none');
        $('#addLayer').css('visibility','hidden');
        $('#typing0').css('display','block');
        if (pastConfig == 'origOption'){
       // switching($('#color0'), $('#typing0'));
        $("#layers").animate({ scrollTop: 0}, "fast");
        }
        $('.optionSelect').val(Session.get('breaksOption'));
    }
    if (Session.get('breaksOption') == 'sentOption'){
//        switching($('#'+pastConfig), $('#sentOption'));
        $('#origOption').css('display','none');
        $('#puncOption').css('display','none');
        $('#sentOption').css('display','inline');
        
//        $('#origOption').css('visibility','hidden');
//        $('#puncOption').css('visibility','hidden');
//        $('#sentOption').css('visibility','visible');
        $('.layer').css('display','none');
        $('#addLayer').css('visibility','hidden');
        $('#typing0').css('display','block');
        if (pastConfig == 'origOption'){
       // switching($('#color0'), $('#typing0'));
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

  