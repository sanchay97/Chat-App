import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const {fullName, username, password, confirmPassword, gender} = req.body
        if(password !== confirmPassword) {
            return res.status(400).json({
                success:false,
                error: "Password do not match"
            });
        }

        const user = await User.findOne({username});

        if(user) {
            return res.status(400).json({
                success:false,
                error: "Username already exist"
            });
        }

        // Hash Password Here
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt); 

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullName,
            username,
            password:hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic
        });

        if(newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                success:true,
                _id:newUser._id,
                fullName:newUser.fullName,
                username:newUser.username,
                profilePic:newUser.profilePic
            });
        }
        else {
            return res.status(400).json({
                success:false,
                error: "Invalid User Data"
            });
        }
    }
    catch(err) {
        res.status(500).json({
            success:false,
            error:err.message
        });
    }
}

export const login = async(req, res) => {
    try {
         const {username, password} = req.body;
         const user = await User.findOne({username});

         // user?.password => it will check if user is undefined or not, if undefined then take empty string "" and compare
         const isPasswordCorrect = await bcrypt.compare(password, user?.password || ""); 

         if(!user || !isPasswordCorrect) {
            return res.status(400).json({
                success:false,
                error: "Invalid username or password"
            });
         }

         generateTokenAndSetCookie(user._id, res);

         res.status(200).json({
            success:true,
            _id:user._id,
            fullName:user.fullName,
            username:user.username,
            profilePic:user.profilePic
        });

    } catch (err) {
        res.status(500).json({
            success:false,
            error:err.message
        });
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt","", {
            maxAge: 0
        });

        res.status(200).json({
            success:true,
            message:"logged out"
        })
    } catch (err) {
        res.status(500).json({
            success:false,
            error:err.message
        });
    }
}