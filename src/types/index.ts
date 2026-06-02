import { Id } from "../../convex/_generated/dataModel";

export interface Candidate {
  _id: Id<"candidates">;
  name: string;
  nickname: string;
  class: string;
  bio: string;
  photoStorageId: string;
  photoUrl: string;
  manifesto: string[];
  colorHex: string;
  isActive: boolean;
  order: number;
}

export interface Vote {
  _id: Id<"votes">;
  candidateId: Id<"candidates">;
  voterName: string;
  voterClass: string;
  ipHash: string;
  fingerprint: string;
  shareToken: string;
  createdAt: number;
}

export interface CandidateWithVotes extends Candidate {
  voteCount: number;
}

export interface VoteResult {
  success: boolean;
  shareToken: string;
  candidateName: string;
  candidatePhotoUrl: string;
}
