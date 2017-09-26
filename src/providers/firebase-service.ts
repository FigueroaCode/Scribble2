import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseListObservable } from 'angularfire2/database';

import { Course } from '../models/course';
import { Chapter } from '../models/chapter';
import { Change } from '../models/change';

@Injectable()
export class FirebaseService {

  constructor(public fireDB: AngularFireDatabase) {

  }

  getDB(){
    return this.fireDB;
  }

  getCurrentUserID(displayName: string){
      let that = this;
      let userIDPromise = new Promise(function(resolve, reject){
        that.fireDB.database.ref('/Users/').once('value').then(function(snapshot){
          snapshot.forEach(function(child){
            if(displayName == child.val().name){
              resolve(child.key);
            }
          });
        });
      });

      return userIDPromise;
  }

  getCourses(){
    return this.fireDB.list('/courses/');
  }

  getMembersCourses(username: string){
    let that = this;
    //grab the users key in order to access their courses
    let coursesPromise = new Promise(function(resolve, reject){
      that.getCurrentUserID(username).then(function(userID){
         resolve(that.fireDB.list('/Users/'+userID+'/courses/'));
      });
    });

    return coursesPromise;
  }

  getChapters(courseKey: string){
      return this.fireDB.list('/courseChapters/'+courseKey);
  }

  getPendingRequest(courseKey: string){
      return this.fireDB.list('/courseJoinRequest/'+courseKey);
  }

  getNoteText(owner: string,courseKey: string, chapterKey: string, isPublic: boolean): Promise<any>{
      let that = this;
      let textPromise = new Promise(function(resolve, reject){
          if(isPublic){
              that.fireDB.database.ref('/courseChapters/'+courseKey+'/'+chapterKey).once('value')
              .then(function(snapshot){
                  resolve(snapshot.val().publicNoteText);
              });
          }else{
            //is Private
            //get just the notes for this owner
              that.fireDB.database.ref('/PrivateNotes/'+chapterKey).orderByChild('owner').equalTo(owner).once('value').then(function(snapshot){
                if(snapshot != undefined){
                  snapshot.forEach(function(child){
                      resolve(child.val().privateNoteText);
                  });
                }else{
                  //create a private note for this user if it doesnt exist
                  that.fireDB.list('/PrivateNotes/'+chapterKey).push({'owner': owner, 'privateNoteText': '', 'dateUpdated': new Date().toString()});
                }
              });
          }
      });
      return textPromise;
  }

  getChangeLog(chapterKey: string){
    return this.fireDB.list('/ChangeLog/'+chapterKey);
  }

  getFirebaseAsArray(username: string){
    let that = this;
    //get the users current courses
    let userCourses = new Promise(function(resolve, reject){
      that.getMembersCourses(username).then(function(memberCourses){
          let courses = memberCourses as FirebaseListObservable<any[]>;
          courses.forEach(function(course){
            resolve(course);
          });
        }
      );
    });
    //get all the courses
    let courses = that.getCourses();
    let allCourses = new Promise(function(resolve,reject){
      courses.forEach(function(course){
          resolve(course);
      });
    });

    let excludedCourses = new Promise(function(resolve,reject){
      userCourses.then(function(memberCoursesObj){

        allCourses.then(function(coursesObj){
          //Filter out the courses which are the same
          let coursesArray = coursesObj as Array<any>;
          let memberCourses = memberCoursesObj as Array<any>;
          let filteredCourses = coursesArray.filter(function(course){
              for(let i = 0; i < memberCourses.length; i++){
                if(memberCourses[i].key == course.key){
                  return false;
                }
              }

              return true;
          });

          resolve(filteredCourses);
        });

      });
      //end of usercourses
    });
    //end of Promise

    return excludedCourses;

  }

  addCourse(course: Course, currentUserID){
      //add a course object to the database

    let key = this.fireDB.list('/courses/').push(course).key;
    this.fireDB.database.ref('/courses/'+key).update({'key': key});

    //Make Dir for holding course chapter
    this.fireDB.database.ref('/courseChapters/'+key).set('');

    //Add the course to the list of courses the user is in
    this.fireDB.database.ref('/Users/'+currentUserID+'/courses/'+key).set(course);
    this.fireDB.database.ref('/Users/'+currentUserID+'/courses/'+key).update({'key': key});
    //this.fireDB.database.ref('/courseMembers/'+key).push({'name': course.getOwner()});

    //Make Dir for holding course requests
    this.fireDB.database.ref('/courseJoinRequest/'+key).set('');
  }

  addChapter(chapter: Chapter, courseKey: string, privateNote){
    //create public chapter
     let chapterKey = this.fireDB.list('/courseChapters/'+ courseKey).push(chapter).key;
     //create private note for the user for that chapter
     //private note has an owner, text, and dateUpdated property
     this.fireDB.list('/PrivateNotes/'+chapterKey).push(privateNote);
     return chapterKey;
  }

  addChange(chapterKey: string, change: Change){
    //add a change to the changelog for this chapters log
    let key = this.fireDB.list('/ChangeLog/'+chapterKey).push(change).key;
    //save the generated key
    this.fireDB.database.ref('ChangeLog/'+chapterKey+'/'+key).update({'key': key});
  }

  sendJoinRequest(courseKey: string, username: string, owner: string){
      let that = this;
      this.fireDB.database.ref('/courses/'+courseKey).once('value').then(function(snapshot){
          let currentCount = snapshot.val().requestCounter;
          let ownerName = snapshot.val().owner;
          //check to see if person already exists and they arent the owner
          if(ownerName != username){
              that.fireDB.database.ref('/courseJoinRequest/'+courseKey).once('value').then(function(snapshot2){
                  let exist = false;

                  snapshot2.forEach(function(child){
                      if(child.val().name == username){
                          exist = true;
                      }
                  });

                  if(!exist){
                      //increase request count
                      currentCount++;
                      //update the course
                      that.fireDB.database.ref('/courses/'+courseKey+'/requestCounter/').set(currentCount);
                      that.getCurrentUserID(owner).then(function(userID){
                        that.fireDB.database.ref('/Users/'+userID+'/courses/'+courseKey+'/requestCounter/').set(currentCount);
                      });

                      that.fireDB.list('/courseJoinRequest/'+courseKey).push({'name': username});
                  }
              });
          }

      });
  }

  joinCourse(courseID: string, username: string){
      let that = this;
      //check that they arent already in the course, check that they arent the owner
      this.getCurrentUserID(username).then(function(userID){
        that.fireDB.database.ref('/Users/'+userID+'/courses/').once('value').then(function(snapshot){
          let exists = false;
          //check all the course keys
          snapshot.forEach(function(course){
            if(course.key == courseID){
              exists = true;
            }
          });

          if(!exists){
            //get the course and make another one in this user
            that.fireDB.database.ref('/courses/').once('value').then(function(snapshot){
              snapshot.forEach(function(child){
                //find the current course that is to be added to the pending user
                if(child.val().key == courseID){
                  //add that course to his/her courses
                  that.fireDB.database.ref('/Users/'+userID+'/courses/'+child.val().key).set(child.val());
                }
              });

            });

          }

        });

      });

  }


  saveNotes(owner: string,courseKey: string,chapterKey: string,text: string,isPublic: boolean){
    if(isPublic){
        this.fireDB.database.ref().child('/courseChapters/'+courseKey+'/'+chapterKey).child('publicNoteText').set(text);
    }else{
      let that = this;
      //get just the notes for this owner
        this.fireDB.database.ref('/PrivateNotes/'+chapterKey).orderByChild('owner').limitToLast(1).once('value').then(function(snapshot){
          if(snapshot != undefined){
            let noteKey = Object.keys(snapshot.val())[0];
            if(text != undefined && text != null && text != "" && noteKey != null && noteKey != undefined){
              that.fireDB.database.ref('/PrivateNotes/'+chapterKey+'/'+noteKey+'/privateNoteText').set(text);
            }
          }else{
            //create a private note for this user if it doesnt exist
            that.fireDB.list('/PrivateNotes/'+chapterKey).push({'owner': owner, 'privateNoteText': '', 'dateUpdated': new Date().toString()});
          }
        });
    }
  }


  removeCourse(id, username: string){
    let that = this;
    //check if they are the owner to permanently delete it
    this.fireDB.database.ref('/courses/'+id).once('value').then(function(snapshot){
      let owner = snapshot.val().owner;
      if(username == owner){
        //delete the course completely
        that.fireDB.list('/courses/').remove(id);
        //delete its chapters and requests
        that.fireDB.list('/courseChapters/').remove(id);
        that.fireDB.list('/courseJoinRequest/').remove(id);
        that.getCurrentUserID(username).then(function(userID){
        that.fireDB.list('/Users/'+userID+'/courses/').remove(id);
        });
      }else{
        let that = this;
        //only delete it from the courses they are a part of
        that.getCurrentUserID(username).then(function(userID){
          that.fireDB.list('/Users/'+userID+'/courses/').remove(id);
        });
      }

    });

  }

  removeChapter(id, courseKey: string){
    this.fireDB.list('/courseChapters/'+courseKey).remove(id);
  }

  removePendingRequest(id, courseKey: string){
    //decrement request counter
    let that = this;
    this.fireDB.database.ref('/courses/'+courseKey).once('value').then(function(snapshot){
        let counter = snapshot.val().requestCounter;
        let owner = snapshot.val().owner;
        if(counter > 0){
          counter--;
          //update it on the database
          that.fireDB.database.ref('/courses/'+courseKey+'/requestCounter/').set(counter);
          that.getCurrentUserID(owner).then(function(userID){
            that.fireDB.database.ref('/Users/'+userID+'/courses/'+courseKey+'/requestCounter/').set(counter);
          });
          that.fireDB.list('/courseJoinRequest/'+courseKey).remove(id);
        }
    });
  }
}
