Template.poem.events({
    
    //show one layer
  'click .show': function(event){
      var layerID = $(event.currentTarget).attr('data-name');
      console.log(layerID);
      var sessionObj = Session.get("layersArray");
      sessionObj[layerID] = "visible";
      Session.set("layersArray", sessionObj);
  }, 
    
  //show one, hide all others
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
     var layerID = $(event.currentTarget).attr('data-name');
     var sessionObj = Session.get("layersArray");
      sessionObj[layerID] = "dimmed";
      Session.set("layersArray", sessionObj);
  },
    
  'click .hideOne': function(event){
      var layerID = $(event.currentTarget).attr('data-name');
      var sessionObj = Session.get("layersArray");
      sessionObj[layerID] = "invisible";
      Session.set("layersArray", sessionObj);
      
  },
    
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
    
    'click .showAll': function(event){
      var layerID = $(event.currentTarget).attr('data-name');
      var sessionObj = Session.get("layersArray");
      var layers = Layers.find().fetch();
      _.each(layers, function(elem){
         sessionObj[elem._id] = "visible";
      });
      Session.set("layersArray", sessionObj);        
    },
    
    'click .hideAll': function(event){
      var layerID = $(event.currentTarget).attr('data-name');
      var sessionObj = Session.get("layersArray");
      var layers = Layers.find().fetch();
      _.each(layers, function(elem){
         sessionObj[elem._id] = "invisible";
      });
      Session.set("layersArray", sessionObj);        
    },
    
    'click .checkSquare': function(event){
       console.log('wow, that worked'); 
       var layerID = $(event.currentTarget).attr('id').substring(11);
       var sessionObj = Session.get("layersArray");
       switch(sessionObj[layerID]){
               //same as code for click .hideOne
                case "visible":
                  sessionObj[layerID] = "invisible";
                  Session.set("layersArray", sessionObj);
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
    }
    
});

//update check boxes function should be here
    
    
    