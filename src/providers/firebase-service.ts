import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase';

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
        that.fireDB.list('/Users/').snapshotChanges(['child_added']).subscribe(function(snapshot){
          snapshot.forEach(function(users){
            let username = users.payload.val().name;
            if(username == displayName){
              resolve(users.key)
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
         resolve(that.fireDB.list('/Users/'+userID+'/courses/').valueChanges());
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
          // if(isPublic){
          //     that.fireDB.object('/courseChapters/'+courseKey+'/'+chapterKey).$ref.once('value')
          //     .then(function(snapshot){
          //         resolve(snapshot.val().publicNoteText);
          //     });
          // }else{
          //   //is Private
          //   //get just the notes for this owner
          //     that.fireDB.object('/PrivateNotes/'+chapterKey).$ref.orderByChild('owner').equalTo(owner).once('value').then(function(snapshot){
          //       if(snapshot.val() != undefined && snapshot.val() != null){
          //         snapshot.forEach(function(child){
          //             resolve(child.val().privateNoteText);
          //         });
          //       }else{
          //         //create a private note for this user if it doesnt exist
          //         that.fireDB.list('/PrivateNotes/'+chapterKey).push({'owner': owner, 'privateNoteText': '', 'dateUpdated': new Date().toString()});
          //       }
          //     });
          // }
      });
      return textPromise;
  }

  getFavoriteCourses(username){
    // return this.fireDB.list('/FavoriteCourses/', {
    //   query: {
    //     orderByChild: 'favUser',
    //     equalTo: username
    //   }
    // });
  }

  getChangeLog(chapterKey: string){
    //return this.fireDB.list('/ChangeLog/'+chapterKey);
    let that = this;
    let changeLog = new Promise(function(resolve,reject){
      // let changes = that.fireDB.list('/ChangeLog/'+chapterKey).forEach(function(change){
      //   resolve(change)
      // });
    });

    return changeLog;
  }

  getChangeLogAsync(chapterKey: string){
    return this.fireDB.list('/ChangeLog/'+chapterKey);
  }

  getFirebaseAsArray(username: string){
    let that = this;
    //get the users current courses
    let userCourses = new Promise(function(resolve, reject){
      // that.getMembersCourses(username).then(function(memberCourses){
      //     let courses = memberCourses as FirebaseListObservable<any[]>;
      //     courses.forEach(function(course){
      //       resolve(course);
      //     });
      //   }
      // );
    });
    //get all the courses
    let courses = that.getCourses();
    let allCourses = new Promise(function(resolve,reject){
      // courses.forEach(function(course){
      //     resolve(course);
      // });
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

    // let key = this.fireDB.list('/courses/').push(course).key;
    // this.fireDB.object('/courses/'+key).$ref.update({'key': key});
    //
    // //Make Dir for holding course chapter
    // this.fireDB.object('/courseChapters/'+key).$ref.set('');
    //
    // //Add the course to the list of courses the user is in
    // this.fireDB.object('/Users/'+currentUserID+'/courses/'+key).$ref.set(course);
    // this.fireDB.object('/Users/'+currentUserID+'/courses/'+key).$ref.update({'key': key});
    // //this.fireDB.database.ref('/courseMembers/'+key).push({'name': course.getOwner()});
    //
    // //Make Dir for holding course requests
    // this.fireDB.object('/courseJoinRequest/'+key).$ref.set('');
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
    //this.fireDB.object('/ChangeLog/'+chapterKey+'/'+key).$ref.update({'key': key});
  }

  getTimeLimit(courseKey: string){
    let that = this;
    let timeLimit = new Promise(function(resolve,reject){
      // that.fireDB.object('/courses/'+courseKey).$ref.once('value').then(function(snapshot){
      //   resolve(snapshot.val().timeLimit);
      // });
    });
    return timeLimit;
  }
  //record that this user voted already for a specific chapter
  userVoted(username: string,chapterKey: string){
    this.fireDB.list('/Voted/'+chapterKey).push({'name':username});
  }

  getMemberCount(chapterKey){
    let that = this;
    let memberCount = new Promise(function(resolve,reject){
      // that.fireDB.object('/ChangeLogQueue/'+chapterKey).$ref.once('value').then(function(snapshot){
      //   resolve(snapshot.val().membersToVote);
      // });
    });

    return memberCount;
  }

  hasUserVoted(chapterKey: string, username: string){
    let that = this;
    let voted = new Promise(function(resolve,reject){
      let usersVoted = that.fireDB.list('/Voted/'+chapterKey);
      // usersVoted.forEach(function(user){
      //   for(let i = 0; i < user.length; i++){
      //     if(user[i].name == username){
      //       resolve(true);
      //     }
      //   }
      //   resolve(false);
      // });
    });

    return voted;
  }

  removeUserVoted(chapterKey: string){
    this.fireDB.list('/Voted/').remove(chapterKey);
  }

  withinTimeLimit(timeLimit, chapterKey){
    //get current time and time vote was started to see how much time has passed
    let that = this;
    let withinTime = new Promise(function(resolve,reject){
      // that.fireDB.object('/ChangeLogQueue/'+chapterKey).$ref.once('value').then(function(snapshot){
      //   let startTime = new Date(snapshot.val().startedAt);
      //   //to get current date, need to send a timestamp to db, then retreive it and convert it to a Date
      //   that.fireDB.object('/CurrentTime/').$ref.set({'time':firebase.database.ServerValue.TIMESTAMP});
      //   that.fireDB.object('/CurrentTime/').$ref.once('value').then(function(snapshot){
      //     let currentTime = new Date(snapshot.val().time);
      //     let timeDiff = currentTime.getTime() - startTime.getTime();
      //     //convert from milliseconds to hours
      //     timeDiff = timeDiff / (3.6 * Math.pow(10,6));
      //     if(timeDiff >= timeLimit){
      //       resolve(false);
      //     }else{
      //       resolve(true);
      //     }
      //   });
      //   //delete the currentTime
      //    that.fireDB.list('/').remove('CurrentTime/');
      // });
    });

    return withinTime;
  }

  queueChangeLog(chapterKey: string, courseKey: string){
    let that = this;
    this.getMembersCount(courseKey).then(function(memberCount){
      let state = {'startedAt': firebase.database.ServerValue.TIMESTAMP,'membersToVote':memberCount as number, 'state': true};

      //that.fireDB.object('/ChangeLogQueue/'+chapterKey).$ref.set(state);
    });
  }

  updateVoteCount(chapterKey: string, change: Change){
    let changeKey = change.key;
    //this.fireDB.object('/ChangeLog/'+chapterKey+'/'+changeKey).$ref.update(change);
  }

  updateMemberCount(chapterKey: string){
    let that = this;

    let membersToVote = new Promise(function(resolve,reject){
      // that.fireDB.object('/ChangeLogQueue/'+chapterKey).$ref.once('value').then(function(snapshot){
      //   let memberCount = snapshot.val().membersToVote;
      //   memberCount--;
      //   //update on db
      //   that.fireDB.object('/ChangeLogQueue/'+chapterKey+'/membersToVote/').$ref.set(memberCount);
      //   //return value in case its needed
      //   resolve(memberCount);
      // });
    });

    return membersToVote;
  }

  decrementMemberCount(courseKey: string){
    let that = this;

    // that.fireDB.object('/courses/'+courseKey).$ref.once('value').then(function(snapshot){
    //   let memberCount = snapshot.val().memberCount;
    //   memberCount--;
    //   that.fireDB.object('/course/'+courseKey+'/memberCount').$ref.set(memberCount);
    // });
  }

  incrementMemberCount(courseKey: string){
    //find all the chapter keys, then look for them in the ChangeLogQueue,
    //then incrementMemberCount for the ones that exist
    let that = this;
    let chapters = this.fireDB.list('/courseChapters/'+courseKey);
    // chapters.forEach(function(snapshot){
    //   let queue = that.fireDB.list('/ChangeLogQueue/');
    //   queue.forEach(function(snapshot2){
    //     for(let i = 0; i < snapshot.length; i++){
    //       for(let j = 0; j < snapshot2.length; j++){
    //         if(snapshot[i].$key == snapshot2[j].$key){
    //           //increment its memberCount of snapshot2 if there is a vote in progress
    //           if(snapshot2[j].state){
    //             let memberCount = snapshot2[j].membersToVote += 1;
    //             that.fireDB.object('/ChangeLogQueue/'+snapshot2[j].$key+'/membersToVote').$ref.set(memberCount);
    //           }
    //         }
    //       }
    //     }
    //   });
    // });
  }

  isVoteInProgress(chapterKey: string){
    let that = this;
    let state = new Promise(function(resolve, reject){
      // that.fireDB.object('/ChangeLogQueue/'+chapterKey).$ref.once('value').then(function(snapshot){
      //   if(snapshot.val() == null){
      //     resolve(false);
      //   }else{
      //     resolve(snapshot.val().state);
      //   }
      // });
    });

    return state;
  }

  setVoteStatus(chapterKey: string, state: boolean){
    this.fireDB.object('/ChangeLogQueue/'+chapterKey+'/state/').set(state);
  }

  sendJoinRequest(courseKey: string, username: string, owner: string){
      let that = this;
      // this.fireDB.object('/courses/'+courseKey).$ref.once('value').then(function(snapshot){
      //     let currentCount = snapshot.val().requestCounter;
      //     let ownerName = snapshot.val().owner;
      //     //check to see if person already exists and they arent the owner
      //     if(ownerName != username){
      //         that.fireDB.object('/courseJoinRequest/'+courseKey).$ref.once('value').then(function(snapshot2){
      //             let exist = false;
      //
      //             snapshot2.forEach(function(child){
      //                 if(child.val().name == username){
      //                     exist = true;
      //                 }
      //             });
      //
      //             if(!exist){
      //                 //increase request count
      //                 currentCount++;
      //                 //update the course
      //                 that.fireDB.object('/courses/'+courseKey+'/requestCounter/').$ref.set(currentCount);
      //                 that.getCurrentUserID(owner).then(function(userID){
      //                   that.fireDB.object('/Users/'+userID+'/courses/'+courseKey+'/requestCounter/').$ref.set(currentCount);
      //                 });
      //
      //                 that.fireDB.list('/courseJoinRequest/'+courseKey).push({'name': username});
      //             }
      //         });
      //     }
      //
      // });
  }

  getMembersCount(courseID: string){
    let that = this;

    let memberCount = new Promise(function(resolve,reject){
      // that.fireDB.object('/courses/'+courseID+'/memberCount/').$ref.once('value').then(function(snapshot){
      //     resolve(snapshot.val());
      // });
    });

    return memberCount;
  }

  joinCourse(courseID: string, username: string){
      let that = this;
      //check that they arent already in the course, check that they arent the owner
      // this.getCurrentUserID(username).then(function(userID){
      //   that.fireDB.object('/Users/'+userID+'/courses/').$ref.once('value').then(function(snapshot){
      //     let exists = false;
      //     //check all the course keys
      //     snapshot.forEach(function(course){
      //       if(course.key == courseID){
      //         exists = true;
      //       }
      //     });
      //
      //     if(!exists){
      //       //increment member count
      //       that.getMembersCount(courseID).then(function(count){
      //         let newCount = count as number;
      //         newCount++;
      //         that.fireDB.object('/courses/'+courseID+'/memberCount/').$ref.set(newCount);
      //       });
      //       //get the course and make another one in this user
      //       that.fireDB.object('/courses/').$ref.once('value').then(function(snapshot){
      //         snapshot.forEach(function(child){
      //           //find the current course that is to be added to the pending user
      //           if(child.val().key == courseID){
      //             //add that course to his/her courses
      //             that.fireDB.object('/Users/'+userID+'/courses/'+child.val().key).$ref.set(child.val());
      //           }
      //         });
      //
      //       });
      //
      //     }
      //
      //   });
      //
      // });

  }


  saveNotes(owner: string,courseKey: string,chapterKey: string,text: string,isPublic: boolean){
    // if(isPublic){
    //     this.fireDB.object('/courseChapters/'+courseKey+'/').$ref.child(chapterKey).child('publicNoteText').set(text);
    // }else{
    //   let that = this;
    //   //get just the notes for this owner
    //     let privateNotes = this.fireDB.list('/PrivateNotes/'+chapterKey, { query: {
    //       orderByChild: 'owner',
    //       equalTo: owner
    //     }});
    //     let noteKey = null;
    //     privateNotes.forEach(function(snapshot){
    //       for(let i = 0; i < snapshot.length; i++){
    //         if(snapshot[i].owner == owner){
    //           noteKey = snapshot[i].$key;
    //           if(text != undefined && text != null && text != "" && noteKey != null){
    //             that.fireDB.object('/PrivateNotes/'+chapterKey+'/'+noteKey+'/privateNoteText/').$ref.set(text);
    //           }
    //         }
    //       }
    //       if(noteKey == null){
    //         that.fireDB.list('/PrivateNotes/'+chapterKey).push({'owner': owner, 'privateNoteText': '', 'dateUpdated': new Date().toString()});
    //       }
    //     });
    // }
  }

  favoriteCourse(course, username){
    //need to be sorted by person that favorited it
    let key = this.fireDB.list('/FavoriteCourses/').push(course).key;
    //this.fireDB.object('/FavoriteCourses/'+key).$ref.update({'favUser': username});
  }

  clearChangeLog(chapterKey: string){
    this.fireDB.list('/ChangeLog/').remove(chapterKey);
  }

  leaveCourse(courseKey: string,username: string){
    //take it away from their courses
    let that = this;
    this.getCurrentUserID(username).then(function(userID){
      that.fireDB.list('/Users/'+userID+'/courses/').remove(courseKey);
    });
    //remove their private notes
    //get all the chapters they belong to
    let courseChapters = this.fireDB.list('/courseChapters/'+courseKey);
    // courseChapters.forEach(function(chapters){
    //   for(let i = 0; i < chapters.length; i++){
    //     let userNotes = that.fireDB.list('/PrivateNotes/'+chapters[i].$key, { query: {
    //       orderByChild: "owner",
    //       equalTo: username
    //     }});
    //
    //     userNotes.forEach(function(notes){
    //       if(notes[0] != null){
    //         that.fireDB.list('/PrivateNotes/'+chapters[i].$key).remove(notes[0].$key);
    //       }
    //
    //     });
    //     //if there is a vote in progress and if they havent voted, then decrement membersToVote
    //     //check if there is a vote in progress
    //     that.isVoteInProgress(chapters[i].$key).then(function(state){
    //       if(state){
    //         that.hasUserVoted(chapters[i].$key,username).then(function(voted){
    //           if(!voted){
    //             //decrementMemberCount
    //             that.updateMemberCount(chapters[i].$key);
    //           }
    //         });
    //       }
    //     });
    //   }
    // });

    //decrement member count on course
    this.decrementMemberCount(courseKey);
  }

  removeCourse(id, username: string){
    let that = this;
    //check if they are the owner to permanently delete it
    // this.fireDB.object('/courses/'+id).$ref.once('value').then(function(snapshot){
    //   let owner = snapshot.val().owner;
    //   if(username == owner){
    //     //delete the course completely
    //     that.fireDB.list('/courses/').remove(id);
    //     //delete its chapters and requests
    //     that.fireDB.list('/courseChapters/').remove(id);
    //     that.fireDB.list('/courseJoinRequest/').remove(id);
    //     that.getCurrentUserID(username).then(function(userID){
    //     that.fireDB.list('/Users/'+userID+'/courses/').remove(id);
    //     });
    //   }else{
    //     let that = this;
    //     //only delete it from the courses they are a part of
    //     that.getCurrentUserID(username).then(function(userID){
    //       that.fireDB.list('/Users/'+userID+'/courses/').remove(id);
    //     });
    //   }
    //
    // });

  }

  removeChapter(id, courseKey: string){
    //remove all private notes for this chapter
    //remove votes in session for this chapter
    //remove chapter
    this.fireDB.list('/courseChapters/'+courseKey).remove(id);
  }

  removeFromFavorite(id){
    this.fireDB.list('/FavoriteCourses/').remove(id);
  }

  removePendingRequest(id, courseKey: string){
    //decrement request counter
    let that = this;
    // this.fireDB.object('/courses/'+courseKey).$ref.once('value').then(function(snapshot){
    //     let counter = snapshot.val().requestCounter;
    //     let owner = snapshot.val().owner;
    //     if(counter > 0){
    //       counter--;
    //       //update it on the database
    //       that.fireDB.object('/courses/'+courseKey+'/requestCounter/').$ref.set(counter);
    //       that.getCurrentUserID(owner).then(function(userID){
    //         that.fireDB.object('/Users/'+userID+'/courses/'+courseKey+'/requestCounter/').$ref.set(counter);
    //       });
    //       that.fireDB.list('/courseJoinRequest/'+courseKey).remove(id);
    //     }
    // });
  }
}
