
export class Note {

    owner: string;
    text: string;
    dateCreated: string;
    isPrivate: boolean;

    constructor(owner: string, text: string, dateCreated: string, isPrivate: boolean){
        this.owner = owner;
        this.text = text;
        this.dateCreated = dateCreated;
        this.isPrivate = isPrivate;
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
        return this.dateCreated;
    }
    getIsPrivate(){
        return this.isPrivate;
    }

    //Setters
    setDateCreated(newDate: string){
        this.dateCreated = newDate;
    }
}
