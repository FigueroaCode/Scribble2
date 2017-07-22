
export class Note {

    key: string;
    owner: string;
    text: string;
    dateCreated: string;
    isPrivate: boolean;

    constructor(key: string, owner: string, text: string, dateCreated: string, isPrivate: boolean){
        this.key = key;
        this.owner = owner;
        this.text = text;
        this.dateCreated = dateCreated;
        this.isPrivate = isPrivate;
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
    getIsPrivate(){
        return this.isPrivate;
    }

    //Setters
    setText(newText: string){
        this.text = newText;
    }
    setDateCreated(newDate: string){
        this.dateCreated = newDate;
    }
}
