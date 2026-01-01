import cloudinary from "../utilis/cloudinary.js";
import { prisma } from '../lib/prisma.js';

export const createPost = async (req, res, next) => {
    try {
        const { id } = req.user;

        // res.send('ok');
        // console.log(id)

        const { description, tags } = req.body;


        const result = await new Promise((resolve, reject) => {
            if (req.file) {
                cloudinary.uploader.upload_stream(
                    { folder: 'post_images' },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                ).end(req.file.buffer);
            } else {
                resolve(null);
            }
        });

        const upLoadedUrl = result ? result.secure_url : null;

        const parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags || '[]');


        const post = await prisma.post.create({
            data: {
                description,
                tags: parsedTags,
                image: upLoadedUrl,
                authorId: id
            }
        })

        res.status(201).json({ message: 'Post created successfully' });

    } catch (err) {
        next(err);
    }
}
export const getAllPostsByUserId = async (req, res, next) => {
    try {

        // const token = req.cookies.loginToken;
        // console.log(token);

        const userId = req.params.userId === "me" ? req.user.id : req.params.userId;

        const posts = await prisma.post.findMany({
            where: {
                authorId: userId
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                author: {
                    select: {
                        firstName: true,
                        lastName: true,
                        profilePicture: true,
                        email: true
                    }
                },
                likes: {
                    where: {
                        userId: req.user.id,
                    }
                },
                comments: {
                    include: {
                        user: {
                            select: {
                                id:true,
                                firstName: true,
                                lastName: true,
                                profilePicture: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        const postWithLikedFlag = posts.map((post) => ({
            ...post,
            isLiked: post.likes.length > 0,
        }));


        res.status(200).json(postWithLikedFlag);
    } catch (err) {
        next(err);
    }
}

export const deletePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        const post = await prisma.post.findUnique({
            where: {
                id: postId
            },
            select: {
                authorId: true
            }
        });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post.authorId !== userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this post' });
        }
        await prisma.post.delete({
            where: {
                id: postId
            }
        });
        res.status(200).json({
            message: 'Post deleted successfully'
        })

    } catch (err) {
        next(err);
    }


}

export const likePost = async (req, res, next) => {
    const { postId } = req.params;
    const userId = req.user.id;

    const aleradyLiked = await prisma.like.findFirst({
        where: {
            userId,
            postId
        }
    });

    if (aleradyLiked) {
        await prisma.$transaction([
            await prisma.like.delete({
                where: {
                    id: aleradyLiked.id
                }
            }),
            await prisma.post.update({
                where: { id: postId },
                data: { likesCount: { decrement: 1 } },
            }),

        ])
    }
    else {

        await prisma.$transaction([
            prisma.like.create({
                data: {
                    user: { connect: { id: userId } },
                    post: { connect: { id: postId } },
                },
            }),
            prisma.post.update({
                where: { id: postId },
                data: { likesCount: { increment: 1 } },
            }),
        ]);
    }

}

export const getAllLikedPosts = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const posts = await prisma.post.findMany({
            where: {
                likes: {
                    some: {
                        userId: userId
                    }
                }
            },
            include: {
                author: {
                    select: {
                        firstName: true,
                        lastName: true,
                        profilePicture: true,
                        email: true
                    }
                },
                comments: {
                    include: {
                        user: {
                            select: {
                                id:true,
                                firstName: true,
                                lastName: true,
                                profilePicture: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        const postWithLikedFlag = posts.map((post) => ({
            ...post,
            isLiked: true,
        }));

        // console.log(posts);

        res.status(200).json(postWithLikedFlag);
    } catch (err) {
        next(err);
    }
}

export const commentPost = async (req, res, next) => {
    try {
        // res.send('ok');

        const postId = req.params.postId;
        const { comment } = req.body;


        const createdComment = await prisma.comment.create({
            data: {
                content: comment,
                post: {
                    connect: {
                        id: postId
                    }
                    
                },
                user: {
                    connect: {
                        id: req.user.id
                    }
                }
            }
        })
        
        const commentWithUserDetial = await prisma.comment.findUnique({
            where: {
                id: createdComment.id
            },
            include: {
                user: {
                    select: {
                        id:true,
                        firstName: true,
                        lastName: true,
                        profilePicture: true,
                        email: true
                    }
                }
            }
        })

        // console.log(commentWithUserDetial);

        res.status(201).json(commentWithUserDetial);
    } catch (err) {
        next(err);
    }
}

export const getAllCommentedPosts = async (req, res, next) => {
    try{
        const userId = req.user.id;

        const posts = await prisma.post.findMany({
            where:{
                comments: {
                    some: {
                        userId: userId,
                    }
                }
            },
            include:{
                author:{
                    select:{
                        firstName: true,
                        lastName: true,
                        profilePicture: true,
                        email: true
                    }
                },
                comments: {
                    include: {
                        user: {
                            select: {
                                id:true,
                                firstName: true,
                                lastName: true,
                                profilePicture: true,
                                email: true
                            }
                        }
                    }
                }
            }
        })

        res.status(200).json(posts);
    }catch(err){
        next(err);
    }
}


export const getPostById = async (req, res, next) => {

}

