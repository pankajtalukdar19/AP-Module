
const User = require('../models/user.schema');
const crypto = require('crypto');

module.exports = {
    login: async (req, res) => {
        let defaultLang = req.headers.defaultlang ? req.headers.defaultlang : 'en';
        try {
            let reqData = req.body ? req.body : {};

            if (reqData.email) {
                reqData.email = reqData.email.toLowerCase();
                reqData.password = String(reqData.password);
            }

            const userFindOneRes = await User.findOne({email: req.body.email}).sort({ createdAt: -1 });

            if (!userFindOneRes) {
                return res.status(400).json({ success: false, msg: "Please create a new account to login." });
            }

            let password = crypto.pbkdf2Sync(reqData.password, userFindOneRes.salt, 1000, 64, 'sha512').toString('hex');
            let query = { email: reqData.email, password: password };

            let userRes = await User.findOne(query).sort({ createdAt: -1 }).select('-password -salt');


            if (!userRes) {
                return res.status(400).json({ success: false, msg: "The email address or password does not exist", msg2: "The email address/ password you have entered does not appear to exist. Please check your entry and try again. ", lang: defaultLang });
            }

            if (userRes.status == 0) {
                return res.status(400).send({
                    success: false,
                    pending_verification: true,
                    msg: "Account verification is pending. Please check your email and click the link mentioned to verify your email. ",
                });
            }

            let token = userRes.generateJwt();
            const user = await User.findById(userRes._id).select('_id email firstname lastname phone role status createdAt updatedAt refreshTokens type is_admin');
            let data = { user, token };

            console.log({data});

            return res.status(201).json({ success: true, data, msg: "You have logged in successfully", lang: defaultLang });
        }
        catch (err) {
            res.status(422).json({ success: false, error: err.message ? err.message : err, msg: "resMessage[defaultLang].Something_Went_Wrong", lang: defaultLang });
        }
    },

    signup: async (req, res) => {
        let defaultLang = req.headers.defaultlang ? req.headers.defaultlang : 'en';
        try {
            let reqData = req.body ? req.body : {};
            const exist = await User.findOne({ "email": reqData.email, "isDeleted": false });
            if (exist) {
                return res.status(400).json({ success: false, msg: "resMessage[defaultLang].Email_Exist", lang: defaultLang })
            }

            let user = new User(reqData);
            const createdUser = await user.save();

            const data = await User.findByIdAndUpdate(createdUser._id, { new: true }).select('_id email role firstName lastName status createdAt updatedAt refreshTokens type');

            return res.status(201).json({ success: true, data, msg: "resMessage[defaultLang].Signup_Success", lang: defaultLang })
        } catch (err) {
            return res.status(500).json({ success: false, msg: "resMessage[defaultLang].Something_Went_Wrong", error: err.message, lang: defaultLang })
        }
    },
    userUpdate: async (req, res) => {
        let defaultLang = req.headers.defaultlang ? req.headers.defaultlang : 'en';
       
        try {
            console.log('res', res);
            let reqData = req.body ? req.body : {};
            // Construct update object dynamically
            let updateObject = {new: false};
            for (let key in reqData) {
                updateObject[key] = reqData[key];
            }
            // Update the user document
            await User.findByIdAndUpdate(reqData._id, updateObject).select('firstname lastname phone');
    
            return res.status(201).json({ success: true, data: reqData, msg: "Profile updated successfully", lang: defaultLang });
        } catch (err) {
            console.error("Error updating profile:", err);
            return res.status(500).json({ success: false, msg: "Something went wrong", error: err.message, lang: defaultLang });
        }
    },
    getUser: async (req, res) => {
        let defaultLang = req.headers.defaultlang ? req.headers.defaultlang : 'en';
        let reqData = req.body ? req.body : {};
        try {
             
           const data = await User.findById(reqData._id).select('_id email role firstName lastName status createdAt updatedAt refreshTokens type');
    
            return res.status(201).json({ success: true, data, msg: "Profile updated successfully", lang: defaultLang });
        } catch (err) {
            console.error("Error updating profile:", err);
            return res.status(500).json({ success: false, msg: "Something went wrong", error: err.message, lang: defaultLang });
        }
    }

}