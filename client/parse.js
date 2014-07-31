
//handles parsing and storage of poem in three forms: original, punctuation, and sentence
parseHTML=function(originalPoemText){
    var poemNaturalDict = createNaturalParse(originalPoemText);
    var poemNaturalParse = poemNaturalDict.poemNaturalParse;
    var poemWordArr = poemNaturalDict.poemWordArr;
    var poemPuncParse = createPuncParse(poemWordArr);
    var poemSentParse = createSentParse(poemWordArr);
    var poemNaturalLines = generateArrofLines(poemNaturalParse, poemWordArr);
    var poemPuncLines = generatePuncArr(poemPuncParse, poemWordArr);
    var poemSentLines = generateSentArr(poemSentParse, poemWordArr);
    var naturalPoemObj = createPoemObj(poemNaturalLines, true, poemNaturalParse);
    var puncPoemObj = createPoemObj(poemPuncLines, false, poemNaturalParse);
    var sentPoemObj = createPoemObj(poemSentLines, false, poemNaturalParse);
    var poemObjsArray = [];
    poemObjsArray.push(naturalPoemObj);
    poemObjsArray.push(puncPoemObj);
    poemObjsArray.push(sentPoemObj);
    console.log(poemObjsArray);
    return poemObjsArray;         
}

//returns words of poem and number of words in each natural line
createNaturalParse =function(originalPoemText){
    var lineCount = 0;
    var wordCount = 0;
    var poemNaturalParse = [];
    var poemWordArr = [];
    var originalLines = originalPoemText.split('\n');
    _.each(originalLines, function(line){
        var lineWords = line.split(' ');
        poemNaturalParse.push(lineWords.length);
        _.each(lineWords, function(word){
            var wordObj = {word_id : "word"+wordCount, class : "line"+lineCount+" word"+wordCount, text : word};
            poemWordArr.push(wordObj);
            wordCount++;
        });
        lineCount++;
    });
    return {"poemNaturalParse": poemNaturalParse, "poemWordArr": poemWordArr};
}

//returns number of words in each line seperated by all punctuation (assumes they are all at ends of words)
createPuncParse = function(poemWordArr){
    var puncWordCount = 0;
    var poemPuncParse = [];
    var puncArray = ['.', ',', '?', '!', '—',':',';','--'];
     _.each(poemWordArr, function(wordObj){
         puncWordCount++;
         wordText = wordObj.text;
         lastChar1 = wordText.slice(-1);
         lastChar2 = wordText.slice(-2);
         if (puncArray.indexOf(lastChar1) > -1 || puncArray.indexOf(lastChar2) > -1 ){
             poemPuncParse.push(puncWordCount);
             puncWordCount = 0;
         }
         else if (poemWordArr.indexOf(wordObj) == (poemWordArr.length - 1)){
             poemPuncParse.push(puncWordCount);
         }
     });
    return poemPuncParse;
}

//returns number of words in each line seperated by sentence punctuation
createSentParse = function(poemWordArr){
    var sentWordCount = 0;
    var sentArray = ['.', '?', '!'];
    var poemSentParse = [];
     _.each(poemWordArr, function(wordObj){
         sentWordCount++;
         wordText = wordObj.text;
         lastChar = wordText.slice(-1);
         if (sentArray.indexOf(lastChar) > -1){
             poemSentParse.push(sentWordCount);
             sentWordCount = 0;
         }
         else if (poemWordArr.indexOf(wordObj) == (poemWordArr.length - 1)){
             poemSentParse.push(sentWordCount);
         }
     });
    return poemSentParse;
}

//returns natural lines
generateArrofLines = function(poemNaturalParse, poemWordArr){
    var lineText = "";
    var start = 0;
    var poemNaturalLines = [];
    _.each(poemNaturalParse, function(numWords){
        for (var i = 0; i < numWords; i++){
           if (i < numWords - 1){
           lineText = lineText + poemWordArr[start+i].text+ " ";}
           else{
               lineText = lineText + poemWordArr[start+i].text;
           }   
        }
        poemNaturalLines.push(lineText);
        start = start + numWords;
        lineText = "";
    });  
    return poemNaturalLines;
}

//returns punctuation lines
generatePuncArr = function(poemPuncParse, poemWordArr){
    var lineText = "";
    var start = 0;
    var poemPuncLines = [];
    _.each(poemPuncParse, function(numWords){
        for (var i = 0; i < numWords; i++){
           if (i < numWords - 1){
           lineText = lineText + poemWordArr[start+i].text+ " ";}
           else{
               lineText = lineText + poemWordArr[start+i].text;
           }   
        }
        poemPuncLines.push(lineText);
        start = start + numWords;
        lineText = "";
    });   
    return poemPuncLines;
}

//returns sentence lines
generateSentArr = function(poemSentParse, poemWordArr){
    var lineText = "";
    var start = 0;
    var poemSentLines = [];
    _.each(poemSentParse, function(numWords){
        for (var i = 0; i < numWords; i++){
           if (i < numWords - 1){
           lineText = lineText + poemWordArr[start+i].text+ " ";}
           else{
               lineText = lineText + poemWordArr[start+i].text;
           }   
        }
        poemSentLines.push(lineText);
        start = start + numWords;
        lineText = "";
    }); 
    return poemSentLines;
}

//uses lines to turn poem into correct object
createPoemObj = function(poemLines, natural, poemNaturalParse){
    var poemObj = [];
    var lineCounter = 0;
    var wordCounter = 0;
    var letterCounter = 0;
    _.each(poemLines, function(line){
        if (natural){
        var lineObj = {type:"line", line_id:"line"+lineCounter, class:"line"+lineCounter+" line col-md-11", content:[]};}
        else{
        var lineObj = {type:"line", line_id:"unnaturalline"+lineCounter, class:"unnaturalLine"+" col-md-11", content:[]};} 
        var wordArray = line.split(' ');
        _.each(wordArray, function(word){
            if (natural){
            var wordObj = {type:"word", word_id:"word"+wordCounter, class:"line"+lineCounter+" word"+wordCounter+" word", content:[]};}
            else{
                var realLine = getNatNum(wordCounter, poemNaturalParse);
                var wordObj = {type:"word", word_id:"word"+wordCounter, class:"line"+realLine+" word"+wordCounter+" word", content:[]};}
            lineObj.content.push(wordObj);
            var letterArray = word.split('');
            _.each(letterArray, function(letter){
                if (natural){
                var letterObj = {type:"letter", letter_id: "char"+letterCounter, class: "line"+lineCounter+" word"+wordCounter+   
                                 " char"+letterCounter+" letter"+" char", content: letter};}
                else{
                   var letterObj = {type:"letter", letter_id: "char"+letterCounter, class: "line"+realLine+" word"+wordCounter+   
                                 " char"+letterCounter+" letter"+" char", content: letter};} 
                wordObj.content.push(letterObj); 
                letterCounter++;
            });  
            wordCounter++;
        });
       poemObj.push(lineObj);  
       lineCounter++;
    }); 
    return poemObj;
};
           
getNatNum = function(wordNum, poemNaturalParse){
    var total = 0;
    for (var i = 0; i < poemNaturalParse.length; i++){
        total = total + poemNaturalParse[i];
        if (total > wordNum){
            return i;
        }
    }   
};