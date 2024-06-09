import jwt, { decode } from 'jsonwebtoken';
import User from '../models/user.model.js';

const protectRoute = async(req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token) {
            return res.status(401).json({
                success:false,
                message:"Unauthorized- No Token Provided"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) {
            return res.status(401).json({
                success:false,
                message:"Unauthorized- Invalid Token"
            });
        }

        //fetch User by userId except password
        const user = await User.findById(decoded.userId).select("-password"); 

        if(!user) {
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            });
        }

        req.user = user;

        next();

    } catch (err) {
        console.log('Error in protectRoute : ', err.message);
        res.status(500).json({
            success:false,
            error:err.message
        });
    }
}

export default protectRoute;