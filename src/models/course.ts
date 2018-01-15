import { Chapter } from './chapter';
import 'rxjs/add/operator/map';

export class Course {

    owner: string;
    searchTitle: string;
    title: string;
    key: string;
    description: string;
    professor: string;
    university: string;
    courseID: string;
    chapters: Array<Chapter>;
    memberCount: number;
    requestCounter: number;
    timeLimit: number;

    constructor(owner: string,searchTitle: string, title: string,key: string,description: string, professor: string,
        university: string, courseID: string,memberCount: number, requestCounter: number, timeLimit: number){
        this.owner = owner;
        this.searchTitle = searchTitle;
        this.title = title;
        this.key = key;
        this.description = description;
        this.professor = professor;
        this.university = university;
        this.courseID = courseID;
        this.memberCount = memberCount;
        this.requestCounter = requestCounter;
        this.timeLimit = timeLimit;

        this.chapters = new Array<Chapter>();
    }

    static fromJsonList(array): Course[] {
      return array.map(Course.fromJson);
    }

    //add more parameters depending on your database entries and Hero constructor
    static fromJson({owner,searchTitle,title,description, professor,university,courseID,memberCount, requestCounter, timeLimit}): Course {

      return new Course(owner,searchTitle, title,description, professor, '',
          university, courseID,memberCount, requestCounter, timeLimit);
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
    getSearchTitle(){
      return this.searchTitle;
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
    getTimeLimit(){
      return this.timeLimit;
    }

    //Setters
    set Owner(newOwner: string){
      this.owner = newOwner;
    }
    set SearchTitle(newTitle: string){
      this.searchTitle = newTitle;
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
    set TimeLimit(time: number){
      this.timeLimit = time;
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
