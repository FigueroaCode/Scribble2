import { Change } from './change';

export class MergeHandler{

  oPrivateNS: Array<Array<string>>; //Original Private Note Sentences
  oPublicNS: Array<Array<string>>; //Original Public Note Sentences
  ePrivateNS: Array<Array<string>>; //edited Private Note Sentences
  ePublicNS: Array<Array<string>>; //edited Public Note Sentences
  privateNoteText: string;
  publicNoteText: string;
  changeLog: Array<Change>;

  constructor(privateNoteText: string, publicNoteText: string){
    this.privateNoteText = privateNoteText;
    this.publicNoteText = publicNoteText;

    this.oPrivateNS = this.separateSentences(this.privateNoteText);
    this.oPublicNS = this.separateSentences(this.publicNoteText);
    this.ePrivateNS = this.filterSentences(this.oPrivateNS);
    this.ePublicNS = this.filterSentences(this.oPublicNS);
  }

  getePrivateNS(){
    return this.ePrivateNS;
  }

  getePublicNS(){
    return this.ePublicNS;
  }

  //Separate the note's text into an array of string arrays.
  //This array contains 'sentences' which are made up of 'words'.
  separateSentences(text: string){
    let words = Array<string>();
    let sentences = Array<Array<string>>();
    let temp = text.toLowerCase();

    //This makes sure the last sentence ends in a period. It's a precaution.
    if(temp[temp.length-1] != '.'){
      temp += '.';
    }

    //This for loop will remove any unnecessary punctuation for similarity calculation.
    for(let i = 0; i < temp.length; i++){
      if(temp[i] == ',' || temp[i] == ';' || temp[i] == '&' || temp[i] == '\'' || temp[i] == '\"'){
        temp = temp.substring(0,i) + temp.substring(i+1);
      }
    }

    let chara = "";

    for(let i = 0; i < temp.length; i++){
      if(temp[i] != ' ' && temp[i] != '\t' && temp[i] != '\n' && temp[i] != '.' && temp[i] != '!' && temp[i] != '?'){
        chara += temp[i];
      }else if(chara != "" && chara != null){
        words.push(chara);
        chara = "";
      }

      if(temp[i] == '.' || temp[i] == '!' || temp[i] == '?'){
        sentences.push(words);
        words = Array<string>();
      }
    }

    return sentences;

  }//End of Method

  filterSentences(oSentences: Array<Array<string>>){
    let temp = oSentences;
    //Iterate through every sentence.
    for(let sIndex = 0; sIndex < oSentences.length; sIndex++){
      let sentence = temp[sIndex];
      //Iterate through every word in that sentence.
      for(let wIndex = 0; wIndex < sentence.length; wIndex++){
        //Remove extraneous words.
        let word = sentence[wIndex];
        if(word == "for" || word == "and" || word == "nor" || word == "but" || word == "or" || word == "yet" || word == "so" || word == "the"){
          sentence.splice(wIndex, 1);
          wIndex--;
        }
      }
      temp[sIndex] = sentence;
    }

    temp = this.removeDuplicateWords(temp);

    return temp;
  }//End of Method

  //Take a wild guess what this method does.
  removeDuplicateWords(text: Array<Array<string>>){
    let temp = text;
    for(let sIndex = 0; sIndex < text.length; sIndex++){
      let currentSentence = text[sIndex];
      for(let wIndex = 0; wIndex < currentSentence.length; wIndex++){
        let currentWord = currentSentence[wIndex];
        for(let w2Index = wIndex+1; w2Index < currentSentence.length; w2Index++){
          let otherWord = currentSentence[w2Index];
          if(currentWord == otherWord){
            currentSentence.splice(w2Index, 1);
            w2Index--;
          }
        }
      }
      temp[sIndex] = currentSentence;
    }

    return temp;
  }

  //Find the differences between two Note object's texts.
  //Create Change objects for each difference.
  findDifferences()
  {

  }//End of Method

  //Compares the words of one sentence to those of another, taking synonyms into
  //consideration.
  compareSentences(sentence1: Array<string>, sentence2: Array<string>){
    let similarWordCount = 0; //How many words from 1 sentence were similar to those of another.
    let longestSentence = 0; //Length of the longest sentence
    if(sentence1.length > sentence2.length){
      longestSentence = sentence1.length;
    }else{
      longestSentence = sentence2.length;
    }

    for(let w1Index = 0; w1Index < sentence1.length; w1Index++){
      let word1 = sentence1[w1Index];
      for(let w2Index = 0; w2Index < sentence2.length; w2Index++){
        let word2 = sentence2[w2Index];
        if(word1 == word2 || this.isSynonym(word1, word2)){
          similarWordCount++;
        }
      }
    }

    let similarity = (similarWordCount * 100)/longestSentence;
    return similarity;
  }//End of Method

  //Compare two words, return true if they are synonymous.
  isSynonym(word1: string, word2: string){

    return true;
  }//End of Method

  //Automates the intermerging of sentences between two Note objects.
  mergeNotes(){

  }

}
