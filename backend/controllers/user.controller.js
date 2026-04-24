import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../models/user.model.js"
import chatgptResponse from "../chatgpt.js"
import moment from "moment"
export const getCurrentUser = async (req, res) => {
    try {

        const userId = req.userId
        const user = await User.findById(userId).select("-password")
        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }

        return res.status(200).json(user)
    } catch (error) {
        return res.status(400).json({ message: "get current user error" })
    }
}


export const updateAssistant = async (req, res) => {
    try {

        const { assistantName, imageUrl } = req.body
        let assistantImage;

        if (req.file) {
            assistantImage = await uploadOnCloudinary(req.file.path)
        } else {
            assistantImage = imageUrl
        }

        const user = await User.findByIdAndUpdate(req.userId, {
            assistantName, assistantImage
        }, { new: true }).select("-password")

        return res.status(200).json(user)

    } catch (error) {
        return res.status(400).json({ message: "Update Assistant error" })
    }
}

export const askToAssistant = async (req, res) => {
    let result;

    try {
        const { command } = req.body;

        const user = await User.findById(req.userId);
        user.history.push(command)
        user.save()
        const userName = user.name;
        const assistantName = user.assistantName;

        // ✅ ChatGPT call
        result = await chatgptResponse(command, assistantName, userName);

        // ✅ safety check
        if (!result) {
            return res.json({
                type: "general",
                userInput: command,
                response: "No response from AI"
            });
        }

        // ✅ clean response
        const cleaned = result.replace(/```json|```/g, "").trim();

        const jsonMatch = cleaned.match(/{[\s\S]*}/);

        if (!jsonMatch) throw new Error("No JSON found");

        const aiResult = JSON.parse(jsonMatch[0]);

        const type = aiResult.type;

        // ✅ switch logic
        switch (type) {

            case 'get_date':
                return res.json({
                    type,
                    userInput: aiResult.userInput,
                    response: `current date is ${moment().format("YYYY-MM-DD")}`
                });

            case 'get_time':
                return res.json({
                    type,
                    userInput: aiResult.userInput,
                    response: `current time is ${moment().format("hh:mm A")}`
                });

            case 'get_day':
                return res.json({
                    type,
                    userInput: aiResult.userInput,
                    response: `today is ${moment().format("dddd")}`
                });

            case 'get_month':
                return res.json({
                    type,
                    userInput: aiResult.userInput,
                    response: `current month is ${moment().format("MMMM")}`
                });

            case 'weather_show':
            case 'google_search':
            case 'youtube_search':
            case 'youtube_play':
            case 'calculator_open':
            case 'instagram_open':
            case 'facebook_open':
            case 'general':
                return res.json({
                    type,
                    userInput: aiResult.userInput,
                    response: aiResult.response,
                });

            default:
                return res.json({
                    type: "general",
                    userInput: command,
                    response: "Sorry, I didn't understand that"
                });
        }


    } catch (error) {
        console.log("Error:", error.message);

        return res.json({
            type: "general",
            userInput: req.body.command,
            response: result || "Server error"
        });
    }
};