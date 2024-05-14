import { IBlogWithAuthor } from "./BlogWithAuthor";
import { IComment } from "./Comment";

export interface  IFullBlog extends IBlogWithAuthor{
    comments: IComment[]
}
