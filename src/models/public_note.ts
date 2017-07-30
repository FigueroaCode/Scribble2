
export class PublicNote {

    text: string;
    dateUpdated: string;

    constructor(text: string, dateUpdated: string){
        this.text = text;
        this.dateUpdated = dateUpdated;
    }
    //TODO
    updateText(){

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
