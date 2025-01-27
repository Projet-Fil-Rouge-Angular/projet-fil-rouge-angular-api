import { UserType } from "./user_type.enum";

export class User {
  id: number;
  username: string;
  password: string;
  type: UserType;
}
