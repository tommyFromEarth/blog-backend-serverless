import { IBlog } from "./Blog";
import { IUser } from "./User";

export interface IBlogWithAuthor extends IBlog {
    user: IUser
}
