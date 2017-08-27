
export class PublicNote {

    text: string;
    dateUpdated: string;
    originalSentences: Array<Array<string>>;

    constructor(text: string, dateUpdated: string){
        this.text = text;
        this.dateUpdated = dateUpdated;
        this.originalSentences = this.separateSentences(this.text);
    }
    //TODO
    updateText(){

    }

    //Separate the note's text into an array of string arrays.
    //This array contains 'sentences' which are made up of 'words'.
    separateSentences(text: string){
      let tempOriginalSentences = [[]];
      let tempWordArray = [];
      let tempWord = "";

      //Iterate through the text, separating it into an array of words
      for(let index = 0; index < text.length; index++){
        if(text[index] == '.' || text[index] == '\n'){
          //Sentence is over.
          //Add the last word to the word array, the add this word array to our sentences array.
          tempWordArray.push(tempWord);
          tempOriginalSentences.push(tempWordArray);

          //Prepare a clean slate for the next sentence.
          tempWord = "";
          while(tempWordArray.length != 0){
            tempWordArray.pop();
          }
        }else if( text[index] == ' ' || text[index] == '\t'){
          //Word is over.
          tempWordArray.push(tempWord);
          tempWord = "";
        }else{
          //Currently examining a word.
          tempWord += text[index];
        }
      }

      //If the last sentence didn't end in a period or space, we still need to add the very last word.
      if(tempWord != ""){
        tempWordArray.push(tempWord);
        tempOriginalSentences.push(tempWordArray);
      }

      return tempOriginalSentences;
    }

    //Getters
    getText(){
      return this.text;
    }
    getDateCreated(){
      return this.dateUpdated;
    }

    //Setters
    setDateCreated(newDate: string){
      this.dateUpdated = newDate;
    }
}
