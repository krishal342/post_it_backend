import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.js';

import generateToken from '../utilis/tokenGeneration.js';

export const signup = async(req, res,next) => {
    try{
        const { firstName, lastName, email, password} = req.body;

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email.toLowerCase()
            }
        })
        if(existingUser){
            return res.status(400).json({error : "User already exist."});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        await prisma.user.create({
            data:{
                firstName,
                lastName,
                email,
                password: hashedPassword
            }
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully", 
        });


    }catch(err){
        next(err);
    }
}

export const login = async(req, res,next) => {

    try{
        const {email, password} = req.body;

        const user = await prisma.user.findUnique({
            where:{email: email.toLowerCase()}
        });

        const verifyPassword = await bcrypt.compare(password, user.password);

        if( !user || !verifyPassword ){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user);

        return res.cookie('loginToken',token).status(200).json({
            success: true,
            message: "User logged in successfully"
        });


    }catch(err){
        next(err);
    }
}

export const logout = async(req, res,next) => {
    try{
        return res.clearCookie("loginToken").status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    }catch(err){
        next(err);
    }

}