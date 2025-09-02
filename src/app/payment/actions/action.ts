export class Action {

  status: number;
  user: string;
  action: string;
  description: string;
  created: string;

  constructor(status: number, user: string, action: string, description: string, created: string) {
    this.status = status;
    this.user = user;
    this.action = action;
    this.description = description;
    this.created = created;
  }
}
