const keys = require('../models/keys_scema');

module.exports = {
    create: async (req, res) => {
        try {
            const new_create = new keys(req.body);
            const data = await new_create.save();
            res.json({ success: true, msg: "key saved successfully", data })
        } catch (err) {
            return res.status(500).json({ success: false, msg: "there is some error", error: err.message})
        }
    },
    getKeys: async (req, res) => {
        try {
          const data = await keys.find()
    
          if (data.length === 0) {
            return res.status(404).json({ success: false, msg: "No applications found" });
          }
          return res.status(200).json({ success: true, msg: "Applications fetched successfully", data });
        } catch (err) {
          return res.status(500).json({ success: false, msg: "Something went wrong", error: err.message });
        }
      },

      getKeysById: async (req, res) => {
        try {
            const data = await keys.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
            res.json({ success: true, msg: "Update Successfull", data });
        } catch (err) {
            return res.status(500).json({ success: false, msg: "Something Went Wrong", error: err.message })
        }
        }
}