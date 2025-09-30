import type { ContestantType } from "features/election/types/contestantType";

export const mockContestants: ContestantType[] = [
  {
    contestant_id: "1",
    firstname: "Alice",
    surname: "Smith",
    picture: "pics.jpeg",
    manifesto: "mn",
    votes: ["v1"],
  },
  {
    contestant_id: "2",
    firstname: "Bob",
    surname: "Smith",
    picture: "pics.jpeg",
    manifesto: "mn",
    votes: ["v2"],
  },
];
