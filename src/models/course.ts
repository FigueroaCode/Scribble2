import { Chapter } from './chapter';

export class Course {

    owner: string;
    title: string;
    key: string;
    description: string;
    professor: string;
    university: string;
    courseID: string;
    chapters: Array<Chapter>;

    members: number;
    memberCount: number;
    requestCounter: number;


    constructor(owner: string, title: string, key: string,description: string, professor: string,
        university: string, courseID: string,members: number,memberCount: number, requestCounter: number){
        this.owner = owner;
        this.title = title;
        this.key = key;
        this.description = description;
        this.professor = professor;
        this.university = university;
        this.courseID = courseID;
        this.members = members;
        this.memberCount = memberCount;
        this.requestCounter = requestCounter;

        this.chapters = new Array<Chapter>();
    }

    addChapter(newChapter: Chapter){
        this.chapters.push(newChapter);
    }

    getChapter(name:string){
        //TODO: Search for the correct chapter using a binary search and sort alphabetically
    }

    removeChapter(index){
        delete this.chapters[index];
    }

    //Getters
    getOwner(){
        return this.owner;
    }
    getTitle(){
        return this.title;
    }
    getKey(){
        return this.key;
    }
    getDescription(){
        return this.description;
    }
    getProfessor(){
        return this.professor;
    }
    getUniversity(){
        return this.university;
    }
    getCourseID(){
        return this.courseID;
    }
    getMemberCount(){
        return this.memberCount;
    }
    getRequestCounter(){
        return this.requestCounter;
    }

    //Setters
    setTitle(newTitle: string){
        this.title = newTitle;
    }
    setDescription(newDescription: string){
        this.description = newDescription;
    }
    setProfessor(newProfessor: string){
        this.professor = newProfessor;
    }
    setUniversity(newUniversity: string){
        this.university = newUniversity;
    }
    setCourseID(newID: string){
        this.courseID = newID;
    }
    incrementMemberCount(){
        this.memberCount++;
    }
    decrementMemberCount(){
        this.memberCount--;
    }
    incrementRequestCounter(){
        this.requestCounter++;
    }
    decrementRequestCounter(){
        this.requestCounter--;
    }
}
