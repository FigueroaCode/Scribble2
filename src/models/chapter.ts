import { Note } from './note';

export class Chapter {

    name: string;
    privateNote: Note;
    publicNote: Note;

    constructor(name: string, privateNote: Note, publicNote: Note){
        this.name = name;
        this.privateNote = privateNote;
        this.publicNote = publicNote;
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
}
