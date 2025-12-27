import "dotenv/config";

// // this is one way to export 
// //
// // how to use on other file
// // import config from ./config/config.js
// // config.PORT - to use
// const config = {
//     PORT: process.env.PORT ,
//     JWT_SECRET: process.env.JWT_SECRET,
// };

// export default config;



export const {
    PORT,
    JWT_SECRET,
    NODE_ENV,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    FRONTEND_URL
} = process.env;
