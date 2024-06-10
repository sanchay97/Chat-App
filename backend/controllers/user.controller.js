import User from "../models/user.model.js";

export const getUsersForSidebar = async(req, res) => {
    try {

        const loggedInUserId = req.user._id;

        // fetch all Users data without password except the current logged in user
        // $ne is "not equal"
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");

        res.status(200).json({
            success:true,
            filteredUsers
        });
        
    } catch (err) {
        console.log("Error in getUsersForSidebar : ", err.message);
        res.status(500).json({
            success:false,
            error:err.message
        })
    }
}