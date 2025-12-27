import { NODE_ENV } from '../config/config.js';
export const debuglLog = (message) => {
    if (NODE_ENV === 'development'){
        console.log(`[DEBUG]: ${message}`);
    }
}