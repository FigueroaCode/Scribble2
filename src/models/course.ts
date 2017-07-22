
export class Course {

    owner: string;
    title: string;
    description: string;
    professor: string;
    university: string;
    courseID: string;

    constructor(owner: string, title: string, description: string, professor: string, university: string, courseID: string){
        this.owner = owner;
        this.title = title;
        this.description = description;
        this.professor = professor;
        this.university = university;
        this.courseID = courseID;
    }

    //Getters
    getOwner(){
        return this.owner;
    }
    getTitle(){
        return this.title;
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
}
