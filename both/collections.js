Poems = new Meteor.Collection('poems');
/* A poem has these fields:
    _id : identifier
    htmlContent : string of HTML for the poem.
         Each line/word/letter is surrounded by a <span>, with
         class set to "line"/"word"/"letter" and with
         id set to "lineN"/"wordN"/"letterN" where N ranges from 0 to # of 
         lines/words/letters in the poem.
*/

Annotations = new Meteor.Collection('annotations')
// Annotations is deprecated, will remove

SyllableMarkers = new Meteor.Collection('syllableMarkers')
/* A syllable marker has:
    _id : identifier
    location: id of letter span that starts the syllable, e.g. "letter23"
*/

Selections = new Meteor.Collection('selections')
/* A selection has:
    _id : identifier
    poem_id : string, id of poem that this selection is in
    style_id : string, id of style in the layer that the selection belongs to
    location : string, id of span that the selection applies to, e.g. "word5" or "line9"
*/

Styles = new Meteor.Collection('styles')
/* A style has:
    _id : identifier
    poem_id : string, id of poem that this style is in
    layer_id : string, id of layer that this style belongs to
    font_color : string, CSS color for text in this style (OPTIONAL)
    background_color : string, CSS background color for text in this style (OPTIONAL) 
    bold : boolean, whether the text is bold or not (OPTIONAL)
    name : string, user-provided description of what the style means, e.g. "feminine rhyme" (OPTIONAL)
*/

Layers = new Meteor.Collection('layers')
/* A layer has:
    _id : identifier
    poem_id : string, id of poem that this layer is in
    name : string, user-provided description of the layer, e.g. "Rhyming scheme"
*/
