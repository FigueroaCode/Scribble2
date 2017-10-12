import { Change } from './change';
import { FirebaseService } from '../providers/firebase-service';

export class MergeHandler{

  oPrivateNS: Array<Array<string>>; //Original Private Note Sentence-Word Array
  oPublicNS: Array<Array<string>>; //Original Public Note Sentence-Word Array
  ePrivateNS: Array<Array<string>>; //edited Private Note Sentence-Word Array
  ePublicNS: Array<Array<string>>; //edited Public Note Sentence-Word Array
  publicSentences : Array<string>;
  privateSentences : Array<string>;
  privateNoteText: string;
  publicNoteText: string;
  changeLog: Array<Change>;
  similarityCeiling = 80; //Something above this % is too similar to another sentence.
  similarityFloor = 40; //Something below this % is not similar enough to any sentences.
  // fireDB : FirebaseService;

  constructor(privateNoteText: string, publicNoteText: string, chapterKey: string, fireDB: FirebaseService){
    this.changeLog = Array<Change>();

    let text = privateNoteText.trim();
    let length = text.length;
    if( text[length-1] != "." && text[length-1] != "?" && text[length-1] != "!"){
      text += "\n";
    }
    this.privateNoteText = text;

    text = publicNoteText.trim();
    length = text.length;
    if( text[length-1] != "." && text[length-1] != "?" && text[length-1] != "!"){
      text += "\n";
    }
    this.publicNoteText = text;

    this.oPrivateNS = this.separateSentences(this.privateNoteText);
    this.oPublicNS = this.separateSentences(this.publicNoteText);
    this.ePrivateNS = this.filterSentences(this.oPrivateNS);
    this.ePublicNS = this.filterSentences(this.oPublicNS);
    this.publicSentences = this.breakIntoSentences(publicNoteText);
    this.privateSentences = this.breakIntoSentences(privateNoteText);
    this.findDifferences();

    for(let i = 0; i < this.changeLog.length; i++){
      fireDB.addChange(chapterKey, this.changeLog[i]);
    }
  }

  getePrivateNS(){
    return this.ePrivateNS;
  }

  getePublicNS(){
    return this.ePublicNS;
  }

  breakIntoSentences(originalText: string){
    let sentences = Array<string>();
    let sentence = "";

    let text = originalText;
    let length = text.length;

    for(let index = 0; index < length; index++){
      if(text[index] != '.' && text[index] != '?' && text[index] != "!"){
        sentence += text[index];
      }else{
        sentences.push(sentence);
        sentence = "";
      }
    }
    return sentences;
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

      if(temp[i] == '.' || temp[i] == '!' || temp[i] == '?' || temp[i] == '\n'){
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
    let highestSimilarity = 0;
    let indexOfChange = 0;
    let previousIndexOfChange = 0; //To be honest, the way the previousIndexOfChange is recorded may not be effective and needs testing.

    for(let s1Index = 0; s1Index < this.ePrivateNS.length; s1Index++){
      let sentence1 = this.ePrivateNS[s1Index];
      for(let s2Index = 0; s2Index < this.ePublicNS.length; s2Index++){
        let sentence2 = this.ePublicNS[s2Index];
        let currentSimiliarity = this.compareSentences(sentence1, sentence2);
        if( currentSimiliarity > highestSimilarity){
          highestSimilarity = currentSimiliarity;
          previousIndexOfChange = indexOfChange;
          indexOfChange = s2Index;
        }
      }
      if(highestSimilarity < this.similarityCeiling && highestSimilarity > this.similarityFloor){
        let change = new Change(this.publicSentences[indexOfChange], this.privateSentences[s1Index], indexOfChange, "", 0, 0);
        this.changeLog.push(change);
      }else if(highestSimilarity <= this.similarityFloor){
        //If something has a similarity of ___ % or less, find a proper index for it.
        let change = new Change("N/A", this.privateSentences[s1Index], previousIndexOfChange, "", 0, 0);
        this.changeLog.push(change);
      }
      highestSimilarity = 0;
    }
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
        //  || this.isSynonym(word1, word2)  <== This needs to be in the if statement below after the method is implemented correctly.
        if(word1 == word2){
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
