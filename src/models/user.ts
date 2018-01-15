import { Course } from './course';
export class User {

    name: string;
    courses: Array<Course>;

    constructor(name: string){
        this.name = name;
        this.courses = new Array<Course>();
    }

    getName(){
        return this.name;
    }

    addCourse(newCourse: Course){
        this.courses.push(newCourse);
    }

    removeCourse(index){
        if(this.courses != null){
            delete this.courses[index];
        }
    }
}
