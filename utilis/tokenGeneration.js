import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";

const generateToken = (user) =>{
    return jwt.sign( {id: user.id, email: user.email}, JWT_SECRET, { expiresIn: '3d' } );
}

export default generateToken;