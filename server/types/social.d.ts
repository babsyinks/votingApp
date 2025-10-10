// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Profile } from "passport";

declare module "passport" {
  interface Profile {
    username?: string;
    emails?: { value: string }[];
    displayName?: string;
  }
}
