import { Chapter } from './chapter';

export class Change {

    originalSentence: string;
    proposedSentence: string;
    key: string;
    approvedVotes: number;
    disapprovedVotes: number;
    indexOfChange: number;
    similarity: number;

    constructor(originalSentence: string, proposedSentence: string, indexOfChange: number, key: string, approvedVotes: number, disapprovedVotes: number){
      if(originalSentence != ''){
        this.originalSentence = originalSentence;
      }else{
        this.originalSentence = "None";
      }

      this.proposedSentence = proposedSentence;
      this.indexOfChange = indexOfChange;
      this.key = key;
      this.approvedVotes = approvedVotes;
      this.disapprovedVotes = disapprovedVotes;
    }

    setSimilarity(similarity: number){
      this.similarity = similarity;
    }

    getSimilarity(){
      return this.similarity;
    }

    getOriginalSentence(){
      return this.originalSentence;
    }

    getProposedSentence(){
      return this.proposedSentence;
    }

    getIndexOfChange(){
      return this.indexOfChange;
    }

}
