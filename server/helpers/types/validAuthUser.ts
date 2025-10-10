import { User } from "../../models";
import { UserAttributesWithRoles } from "../../models/user";

export type ValidUser = User | UserAttributesWithRoles;
