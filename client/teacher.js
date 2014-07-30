Template.teacher.isReady = function(){
  return checkIsReady();  
}

Template.teacher.events({
    'click #submitPoem':function(){
        var title = $('#title').val();
        var author = $('#author').val();
        var raw=$('#createPoem').val();
        var html=parseHTML(raw);
        var newPoem = Poems.insert({
            title:title,
            author:author,
            htmlContent:html
        })
        $div = $('<div>')
        $div.attr('title', 'Launch')
        url = window.location.host + '/poem/' + newPoem
        $div.html('Your PoemViz is at ' + url + '<br>')
        $div.dialog({
          resizable: false,
          height:250,
          width:500,
          modal: true,
          buttons: {
            "Go": function() {
              $( this).dialog('close');
              window.open('/poem/'+newPoem, '_blank');
            },
            Cancel: function() {
              $( this ).dialog( "close" );
            }
          }
        })
        Layers.insert({
            name:'Text Options',
            id:'typing0',
            poem_id:newPoem,
            type:'typing'
        });
        Layers.insert({
            name:'Sound',
            id:'color0',
            poem_id:newPoem,
            type:'rhyme'
        });
        Layers.insert({
            name:'Syllables',
            id:'syllable0',
            poem_id:newPoem,
            type:'syllable'
        });
        var sel=Layers.insert({
            name:'Meter',
            id:'stress0',
            poem_id:newPoem,
            type:'stressing',
        });
        
        var selStyle=Styles.insert({poem_id: newPoem, layer_id: 'stress0', verticalAlign:'super'});
        Layers.update(sel, {$set:{style:selStyle}})

    }
})