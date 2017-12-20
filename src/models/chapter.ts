export class Chapter {

    chapterName: string;
    publicNoteText: string;
    dateUpdated: string;

    constructor(name: string, publicNoteText: string, dateUpdated: string){
        this.chapterName = name;
        this.publicNoteText = publicNoteText;
        this.dateUpdated = dateUpdated;
    }

    //Getters
    getName(){
        return this.chapterName;
    }

    getPublicNoteText(){
      return this.publicNoteText;
    }

    getDate(){
      return this.dateUpdated;
    }

    //Setters
    setName(newName: string){
        this.chapterName = newName;
    }

    setPublicNoteText(text: string){
      this.publicNoteText = text;
    }

    setDateUpdated(date: string){
      this.dateUpdated = date;
    }


}
