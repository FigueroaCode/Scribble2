
export class Note {

    key: string;
    owner: string;
    text: string;
    dateCreated: string;

    constructor(key: string, owner: string, text: string, dateCreated: string){
        this.key = key;
        this.owner = owner;
        this.text = text;
        this.dateCreated = dateCreated;
    }
    //TODO
    updateText(){

    }

    //Getters
    getKey(){
        return this.key;
    }
    getOwner(){
        return this.owner;
    }
    getText(){
        return this.text;
    }
    getDateCreated(){
        return this.dateCreated;
    }

    //Setters
    setText(newText: string){
        this.text = newText;
    }
    setDateCreated(newDate: string){
        this.dateCreated = newDate;
    }
}
