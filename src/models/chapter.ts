import { PrivateNote } from './private_note';
import { PublicNote } from './public_note';

export class Chapter {

    name: string;
    privateNote: PrivateNote;
    publicNote: PublicNote;


    constructor(name: string, publicNote: PublicNote, privateNote: PrivateNote){
        this.name = name;
        this.publicNote = publicNote;
        this.privateNote = privateNote;
    }

    getPrivateNote(){
        return this.privateNote;
    }
    getPublicNote(){
        return this.publicNote;
    }

    getName(){
        return this.name;
    }

    setName(newName: string){
        this.name = newName;
    }

    setPrivateNote(tempNote: PrivateNote){
      this.privateNote = tempNote;
    }

    setPublicNote(tempNote: PublicNote){
      this.publicNote = tempNote;
    }

    //Find the differences between two Note object's texts.
    //Create Change objects for each difference.
    findDifferences(tempNote: PrivateNote)
    {

    }

    //Compares the words of one sentence to those of another, taking synonyms into
    //consideration.
    compareSentences(sentence1: Array<string>, sentence2: Array<string>){

    }

    //Compare two words, return true if they are synonymous.
    isSynonym(word1: string, word2: string){

    }

    //Automates the intermerging of sentences between two Note objects.
    mergeNotes(){

    }

}
