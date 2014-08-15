Template.poem.events({  
  //show one layer
  'click .show': function(event){
      var layerID = $(event.currentTarget).attr('data-name');
      console.log(layerID);
      var sessionObj = Session.get("layersArray");
      sessionObj[layerID] = "visible";
      Session.set("layersArray", sessionObj);
  }, 
    
  //show one layer, hide all others
  'click .showOne': function(event){
      var layerID = $(event.currentTarget).attr('data-name');
      console.log(layerID);
      var sessionObj = Session.get("layersArray");
      var layers = Layers.find().fetch();
      _.each(layers, function(elem){
         sessionObj[elem._id] = "invisible";
      });
      sessionObj[layerID] = "visible";
      Session.set("layersArray", sessionObj);
  },
    
   //only available on color layers
  'click .dimOne': function(event){
    // event.stopPropagation();
     var layerID = $(event.currentTarget).attr('data-name');
     var sessionObj = Session.get("layersArray");
      sessionObj[layerID] = "dimmed";
      Session.set("layersArray", sessionObj);
    //  $(".dropdown-menu-right").dropdown("toggle");
  },
   
  //hide one layer
  'click .hideOne': function(event){
     // event.stopPropagation();
      var layerID = $(event.currentTarget).attr('data-name');
      var sessionObj = Session.get("layersArray");
      sessionObj[layerID] = "invisible";
      Session.set("layersArray", sessionObj);
      //Session.set('curLayer','undefined');
       //$(".dropdown-menu-right").dropdown("toggle");
      
  },
    
    //show one layer, dim all others
    'click .showOneDimOthers': function(event){
      var layerID = $(event.currentTarget).attr('data-name');
      var sessionObj = Session.get("layersArray");
      var layers = Layers.find().fetch();
      _.each(layers, function(elem){
         if (elem.type == "rhyme"){
             sessionObj[elem._id] = "dimmed";
         }
      });
      sessionObj[layerID] = "visible";
      Session.set("layersArray", sessionObj);      
    },
    
    //show all layers
    'click .showAll': function(event){
      console.log('show all is clicked');
      var layerID = $(event.currentTarget).attr('data-name');
      var sessionObj = Session.get("layersArray");
      var layers = Layers.find().fetch();
      _.each(layers, function(elem){
         sessionObj[elem._id] = "visible";
      });
      Session.set("layersArray", sessionObj);        
    },
    
    //hide all layers
    'click .hideAll': function(event){
     // event.stopPropagation();
      var layerID = $(event.currentTarget).attr('data-name');
      var sessionObj = Session.get("layersArray");
      var layers = Layers.find().fetch();
      _.each(layers, function(elem){
         sessionObj[elem._id] = "invisible";
      });
      Session.set("layersArray", sessionObj);  
     // Session.set('curLayer','undefined');
      //$(".dropdown-menu-right").dropdown("toggle");
    },
    
    //user can also change visibilities of layers by clicking on the checkmark icon
    'click .checkSquare': function(event){
       var layerID = $(event.currentTarget).attr('id').substring(11);
       var sessionObj = Session.get("layersArray");
       switch(sessionObj[layerID]){
               //same as code for click .hideOne
                case "visible":
                 // event.stopPropagation();
                  sessionObj[layerID] = "invisible";
                  Session.set("layersArray", sessionObj);
                 // Session.set('curLayer','undefined');
                  break;
               //same as code for click .show
                case "dimmed":
                  sessionObj[layerID] = "visible";
                  Session.set("layersArray", sessionObj);
                  break;
               //same as code for click .show
                case "invisible":
                  sessionObj[layerID] = "visible";
                  Session.set("layersArray", sessionObj); 
                  break;
                default:
                //oops
        }  
    },
    
/*    'click .dropOp': function(event){
      var drop = $(event.currentTarget).closest(".dropdown-menu-right");
      console.log($(drop));
     $(drop).dropdown("toggle");
}*/
                     
});

