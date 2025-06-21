export interface LoginUser {
  username: string;
  password: string;
}

export interface LsUser {
  firstname: string;
  email: string;
  id:number;
}
export interface User {
  id: number;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  phone: number;
  email: string;
  isAdmin: boolean;
  isReviewer: boolean;
}
