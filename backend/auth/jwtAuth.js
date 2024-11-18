const User = require('../models/user.schema');

module.exports = {
    isAuth: async (req, res, next) => {
        try {
            if (!req.headers['authorization'] || req.headers['authorization'] === 'undefined') {
                return res.send({ success: false, code: 401, msg: "Not_Login" });
            }
            const user = new User();

            user.verifyToken(req.headers['authorization'], async (valid) => {
                if (!valid) {
                    return res.status(401).send({ success: false, msg: "Unauthorise" });
                } else {
                    req.userParams = valid;
                    let query = { _id: valid._id };

                    let data = await User.findOne(query)
                    if (!data) {
                        return res.status(401).send({ success: false, msg: "Unauthorise" });
                    }
                    next();
                }

            })
        }
        catch (err) {
            return res.status(401).send({ success: false, msg: "Not_Login", error: err.message });
        }
    },
}
