
export class PrivateNote {

    owner: string;
    text: string;
    dateUpdated: string;

    constructor(owner: string, text: string, dateUpdated: string){
        this.owner = owner;
        this.text = text;
        this.dateUpdated = dateUpdated;
    }
    //TODO
    updateText(){

    }

    //Getters
    getOwner(){
      return this.owner;
    }
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
