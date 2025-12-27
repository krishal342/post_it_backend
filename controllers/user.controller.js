import { prisma } from '../lib/prisma.js';
import cloudinary from '../utilis/cloudinary.js';
import bcrypt from 'bcrypt';


export const getProfile = async (req, res, next) =>{
    try{
        const userId = req.params.userId === "me" ? req.user.id : req.params.userId;

        // console.log(userId);

        const user = await prisma.user.findUnique({
            where:{id: userId},
            select:{
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profilePicture: true
            }
        })


        if(!user){
            return res.status(404).json({
                error: "User not found"
            });
        }
        return res.status(200).json(user);
    }catch(err){
        next(err);
    }

}

export const updateProfile = async (req, res, next) => { 
    try{
        const id = req.user.id;
        const { firstName, lastName, email } = req.body;

        // if(req.file){

        //      result = await cloudinary.uploader.upload(req.file.path);
        //     fs.unlinkSync(req.file.path);
        // }

        if(req.file){
            const stream = cloudinary.uploader.upload_stream(
                {folder: 'profile_pictures'},
                async(error, result) => {
                    if(error){
                        return next(error);
                    }
                    await prisma.user.update({
                        where: {id: id},
                        data: {
                            firstName: firstName,
                            lastName: lastName,
                            email: email,
                            profilePicture: result.secure_url
                        }
                    })
                    return res.status(200).json({success: true, message: "Profile updated successfully"});
                }
            );
        }
    }catch(err){
        next(err);
    }

}

export const deleteProfile = async (req, res, next) => {
    try{
        const id = req.user.id;
        const {password } = req.body;

        const user = await prisma.user.findUnique({
            where: {id: id},
            select: { password: true }
        });

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({ error: "Incorrect password"});
        }

        await prisma.user.delete({
            where: {id: id}
        });
        return res.status(200).json({ success: true, message: "User profile deleted successfully"});
        
    }catch(err){
        next(err);
    }
}