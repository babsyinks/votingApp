import { v4 as uuidv4 } from "uuid";

const mapContents = (arr) => arr.map((content) => ({ id: uuidv4(), content }));

const contents1 = [
  "Transparent voting process",
  "Real-time vote counting",
  "Secure authentication for all voters",
  "Intuitive user-friendly voting interface",
  "Flexibility in setting election period",
];

const contents2 = [
  "Real-time voting statistics",
  "Candidate manifestos and profiles",
  "Prevention of double voting",
  "Easy-to-access results dashboard",
  "Election start and end countdown timers",
];

const items = {
  item1: {
    title: "What You Can Expect:",
    contents: mapContents(contents1),
  },
  item2: {
    title: "Features of VoteNow:",
    contents: mapContents(contents2),
  },
};

export default items;
