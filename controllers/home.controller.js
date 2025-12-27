import { prisma } from "../lib/prisma.js";

export const getPosts = async ( req , res , next) =>{
    try{
        const posts = await prisma.post.findMany({
            include:{
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePicture: true,
                        email: true
                    }
                }
            }
        });

        return res.status(200).json(posts);

        // id, image, description, tags, authorId, createdAt, updatedAt, likesCount
    }catch(err){
        next(err);
    }
}