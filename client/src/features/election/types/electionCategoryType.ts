import type { ContestantType } from "./contestantType";

export interface ElectionCategory {
  position: string;
  positionVotes: string[];
  contestants: ContestantType[];
}
