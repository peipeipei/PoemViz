var colors=['Yellow', 'LightBlue', 'LightPink', 'LightGreen', 'Plum', 'LightSalmon'];
var highlightCount=0;

$(document).ready(function(){
   $('.poemLine').each(function(){
       var check =$('<input type="checkbox" class="rhymeCheck">');
       $(this).prepend(check)
   });

   
   $('.rhymeHighlight').on('click',function(){
       var checkboxes=$('.rhymeCheck');
       var checked=[];
       checkboxes.each(function(){
        if (this.checked === true){
            checked.push(this);
            this.checked = false;
        }
       });
       
       checked.forEach(function(c){
           $($(c).parent()).find('span').css('background-color', colors[highlightCount]);
       });
       highlightCount++;
   });
   
   $('.syllablesOption').on('click',function(){
       
   });
});

