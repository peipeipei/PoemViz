Meteor.startup(function () {	

  if(Poems.find().count() == 0){
    var poem_id = Poems.insert({
      htmlContent:  "<div class='poem'>"+
                    "<p class='poemLine'><span>When, in disgrace with fortune and men's eyes,</span></p>"+
                    "<p class='poemLine'><span>I all alone beweep my outcast state,</span></p>"+
                    "<p class='poemLine'><span>And trouble deaf heaven with my bootless cries,</span></p>"+
                    "<p class='poemLine'><span>And look upon myself, and curse my fate,</span></p>"+
                    "<p class='poemLine><span>Wishing me like to one more rich in hope,</span></p>"+
                    "<p class='poemLine><span>Featur'd like him, like him with friends possess'd,</span></p>"+
                    "<p class='poemLine'><span>Desiring this man's art and that man's scope,</span></p>"+
                    "<p class='poemLine'><span>With what I most enjoy contented least;</span></p>"+
                    "<p class='poemLine'><span>Yet in these thoughts myself almost despising,</span></p>"+
                    "<p class='poemLine'><span>Haply I think on thee, and then my state,</span></p>"+
                    "<p class='poemLine'><span>Like to the lark at break of day arising</span></p>"+
                    "<p class='poemLine'><span>From sullen earth, sings hymns at heaven's gate;</span></p>"+
                    "<p class='poemLine'><span>For thy sweet love remember'd such wealth brings</span></p>"+
                    "</div>"
    })   
   
  }
})