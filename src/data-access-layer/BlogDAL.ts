import { IBlog } from '@interfaces/Blog';
import { IBlogWithAuthor } from '@interfaces/BlogWithAuthor';
import { IComment } from '@interfaces/Comment';
import { IFullBlog } from '@interfaces/FullBlogDataSet';
import { IUser } from '@interfaces/User';
import { BadRequestException} from '@utils/Exceptions';
import { API } from '@utils/Utils';
import axios from 'axios';

export class Blog{
    static async getPostList(start: number, size: number):Promise<IFullBlog[]>{
        try {
            const query: IBlog[] = await Blog.queryPosts(start, size)
            const postsWithAuthors: IBlogWithAuthor[] = await Blog.matchPostsWithAuthors(query)
            const completePosts : IFullBlog[] = await Blog.matchPostsWithComments(postsWithAuthors)
           return completePosts
        } catch (error) {
            const msg = (error as Error).message;
            throw new BadRequestException(msg, error);
        }
    }

    static async queryPosts(start: number, size: number):Promise<IBlog[]>{
        const url: string = `${API}posts`
        const end: number = start+size;
        try {
            const request = await axios.get(url);
            let posts: IBlog[] = request.data;
            posts = posts.filter((post: IBlog)=>{
                return (post.id > start && post.id <= end) 
            })
                return posts
        } catch (error) {
            const msg = (error as Error).message;
            throw new BadRequestException(msg, error);
        }
    }

    static async getAuthor(id: number):Promise<IUser>{
        const url: string = `${API}users/${id}`
        try {
            const request = await axios.get(url);
            const user: IUser = request.data;
            return user
        } catch (error) {
            const msg = (error as Error).message;
            throw new BadRequestException(msg, error);
        }
    }

    static async getComments(id: number):Promise<IComment[]>{
        const url: string = `${API}posts/${id}/comments`
        try {
            const request = await axios.get(url);
            const comments: IComment[] = request.data;
            return comments
        } catch (error) {
            const msg = (error as Error).message;
            throw new BadRequestException(msg, error);
        }
    }

    static async matchPostsWithAuthors(query: IBlog[]):Promise<IBlogWithAuthor[]>{
        try {
            const posts: IBlogWithAuthor[] = [];
            for (let index = 0; index < query.length; index++) {
                const item:IBlog = query[index];
                const user = await Blog.getAuthor(item.userId)
                const post: IBlogWithAuthor =  {
                    id: item.id,
                    userId: item.userId,
                    title: item.title,
                    body: item.body,
                    user: user,
                }
                posts.push(post)
            }
            return posts
        } catch (error) {
            const msg = (error as Error).message;
            throw new BadRequestException(msg, error);
        }
    }

    static async matchPostsWithComments(query: IBlogWithAuthor[]):Promise<IFullBlog[]>{
        try {
            const posts: IFullBlog[] = [];
            for (let index = 0; index < query.length; index++) {
                const item:IBlogWithAuthor = query[index];
                const comments = await Blog.getComments(item.id)
                const post: IFullBlog =  {
                    id: item.id,
                    userId: item.userId,
                    title: item.title,
                    body: item.body,
                    user: item.user,
                    comments: comments
                }
                posts.push(post)
            }
            return posts
        } catch (error) {
            const msg = (error as Error).message;
            throw new BadRequestException(msg, error);
        }
    }
}