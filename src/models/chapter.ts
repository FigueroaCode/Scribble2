import { Note } from './note';

export class Chapter {

    name: string;
    key: string;
    privateNote: Note;
    publicNote: Note;

    constructor(name: string, key: string, publicNote: Note, privateNote: Note){
        this.name = name;
        this.key = key;
        this.privateNote = privateNote;
        this.publicNote = publicNote;
    }

    getPrivateNote(){
        return this.privateNote;
    }
    getKey(){
        return this.key;
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
