Poems = new Meteor.Collection('poems');
/* A poem has these fields:
    _id : identifier
    title : give by user, string
    author : given by user, string
    htmlContent : string of HTML for the poem.
         Each line/word/letter is surrounded by a <span>, with
         class set to "line"/"word"/"letter" and with
         id set to "lineN"/"wordN"/"letterN" where N ranges from 0 to # of 
         lines/words/letters in the poem.
*/

LineCounts = new Meteor.Collection('lineCounts')
/* A line count has:
    _id : identifier
    line: id of line span that starts the syllable, e.g. "line3"
    poem_id:which poem the line count is on
*/

SyllableMarkers = new Meteor.Collection('syllableMarkers')
/* A syllable marker has:
    _id : identifier
    location: id of letter span that starts the syllable, e.g. "letter23"
    poem_id:which poem the marker is on
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
    opacity: opacity of background color (OPTIONAL)
    name : string, user-provided description of what the style means, e.g. "feminine rhyme" (OPTIONAL)
    verticalAlign: "super" when using stress marks; only used once in poem with stress marks (OPTIONAL)
*/

Layers = new Meteor.Collection('layers');
/* A layer has:
    _id : identifier
    id: identifier in html
    poem_id : string, id of poem that this layer is in
    name : string, user-provided description of the layer, e.g. "Rhyming scheme"
    type: whether it is used for selections, markers, bold, or typing
*/

Colors = new Meteor.Collection('colors');
/*
     _id: identifier
     poem_id: string, id of poem that this layer is in
     layer_id: string, id of layer that this color is in
     color_value: string, 
     name: string, user input

*/

Shoutkeys = new Meteor.Collection('shoutkeys');
/*
     _id: identifier
     poem_id: string, id of the poem the key maps to
     key: string, random shoutkey keyword 
*/

ColorIndices = new Meteor.Collection('indices');
 /*
    _id: identifier
    poem_id: string, id of the corresponding Poems
    index: number, increasing when you add more colors to the palette
*/