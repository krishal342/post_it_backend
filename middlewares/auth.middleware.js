import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config/config.js';
const authMiddleware = async (req, res, next) => {
    try{
        const token = req.cookies.loginToken;
        if(!token){
            return res.status(401).json({
                error: "Unauthorized"
            });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        next(err);
    }
}

export default authMiddleware;