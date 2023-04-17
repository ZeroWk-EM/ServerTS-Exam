export interface IUser {
  firstname: string;
  surname: string;
  age: number;
  gender: "Male" | "Female" | "No-Binary";
  username: string;
  email: string;
  password: string;
  verify_token?: string;
}
