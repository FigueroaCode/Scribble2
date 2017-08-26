import { Chapter } from './chapter';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export class Course {

    owner: string;
    title: string;
    key: string;
    description: string;
    professor: string;
    university: string;
    courseID: string;
    chapters: Array<Chapter>;
    memberCount: number;
    requestCounter: number;

    constructor(owner: string, title: string,key: string,description: string, professor: string,
        university: string, courseID: string,memberCount: number, requestCounter: number){
        this.owner = owner;
        this.title = title;
        this.key = key;
        this.description = description;
        this.professor = professor;
        this.university = university;
        this.courseID = courseID;
        this.memberCount = memberCount;
        this.requestCounter = requestCounter;

        this.chapters = new Array<Chapter>();
    }

    static fromJsonList(array): Course[] {
      return array.map(Course.fromJson);
    }

    //add more parameters depending on your database entries and Hero constructor
    static fromJson({owner, title,description, professor,university,courseID,memberCount, requestCounter}): Course {

      return new Course(owner, title,description, professor, '',
          university, courseID,memberCount, requestCounter);
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
    set Owner(newOwner: string){
      this.owner = newOwner;
    }
    set Title(newTitle: string){
        this.title = newTitle;
    }
    set Description(newDescription: string){
        this.description = newDescription;
    }
    set Professor(newProfessor: string){
        this.professor = newProfessor;
    }
    set University(newUniversity: string){
        this.university = newUniversity;
    }
    set CourseID(newID: string){
        this.courseID = newID;
    }
    set MemberCount(newCount: number){
      this.memberCount = newCount;
    }
    set RequestCounter(newCount: number){
      this.requestCounter = newCount;
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
