import { Code } from "../code";
import { Contestants } from "../contestants";
import { Election } from "../election";
import { Organization } from "../organization";
import { Timer } from "../timer";
import { User } from "../user";
import { UserOrganization } from "../userOrganization";
import { Votes } from "../votes";

export interface Models {
  User: typeof User;
  Organization: typeof Organization;
  UserOrganization: typeof UserOrganization;
  Election: typeof Election;
  Contestants: typeof Contestants;
  Timer: typeof Timer;
  Votes: typeof Votes;
  Code: typeof Code;
}
