import { prisma } from "../lib/prisma.js";
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config/config.js';

export const getPosts = async (req, res, next) => {
    try {

        let  userId = "";

        const token = req.cookies.loginToken;


        if (token != 'undefined') {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
    
            userId = req.user.id;
        }





        const posts = await prisma.post.findMany({
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
                        userId: userId
                    }
                },
                comments: {
                    orderBy: {
                        createdAt: 'asc'
                    },
                    include:{
                        user: {
                            select: {
                                id: true,
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

        const postWithLikedFlag = posts.map((post) => {
            return {
                ...post,
                isLiked: post.likes.length > 0
            }
        })

        return res.status(200).json(postWithLikedFlag);

        // id, image, description, tags, authorId, createdAt, updatedAt, likesCount
    } catch (err) {
        next(err);
    }
}