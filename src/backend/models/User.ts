import { v4 as uuid } from "uuid";

export interface IUser {
  id: string; // uuid
  email: string;
  name: string;
  verified: boolean;
  created: Date;
  updated: Date;
  profile: {
    displayName: string;
    avatar: string; // url
  },
  hash: string;
  salt: string;
}

class User implements IUser {
  id: string;
  email: string;
  name: string;
  verified: boolean;
  created: Date;
  updated: Date;
  profile: {
    displayName: string;
    avatar: string;
  }
  hash: string;
  salt: string;

  constructor(email: string, name: string, verified?: boolean, profile?: { displayName: string; avatar: string; }, hash?: string, salt?: string) {
    this.id = uuid();
    this.email = email;
    this.name = name;
    this.verified = verified ?? false;
    this.created = new Date();
    this.updated = new Date();
    this.profile = profile || {
      displayName: "",
      avatar: ""
    };
    this.hash = hash || "";
    this.salt = salt || "";
  }

  static present(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      profile: user.profile
    }
  }
}

export default User;