import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js"

export const sendMessage = async(req, res) => {
    try {
        const {message} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id;

        //find all entries where participants array includes this sendId and receiverId
        let conversation = await Conversation.findOne({
            participants: {$all: [senderId, receiverId]}
        });

        //if these participants messaging for the first time
        if(!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }

        const newMessage = await Message({
            senderId,
            receiverId,
            message
        });

        if(newMessage) {
            conversation.messages.push(newMessage._id);
        }

        // SOCKET IO FUNCTIONALITY WILL BE HERE

        // await conversation.save();
        // await newMessage.save();

        //this will run in parallel, above will not
        await Promise.all([conversation.save(), newMessage.save()]);

        res.status(201).json({
            success:true,
            newMessage
        });

    } catch (err) {
        console.log("Error in sendMessage : ", err.message);
        res.status(500).json({
            success:false,
            error:err.message
        });
    }
}

export const getMessages = async(req, res) => {
    try {
        const {id:userToChatId} = req.params;

        const senderId = req.user._id;

        // This will populate the conversation messages array
        // with all the data of message collection instead of
        // just id.
        const conversation = await Conversation.findOne({
            participants: {$all: [senderId, userToChatId]}
        }).populate("messages");

        if(!conversation) {
            return res.status(200).json({success:true,messages:[]});
        }

        const messages = conversation.messages

        res.status(200).json({success:true,messages});

    } catch (err) {
        console.log("Error in getMessages : ", err.message);
        res.status(500).json({
            success:false,
            error:err.message
        });
    }
}