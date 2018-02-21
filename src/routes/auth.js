import express from 'express';
import User from "../models/User";

const router = express.Router();

router.post('/', (req, res) => {
    const { credentials } = req.body;
    User.findOne({
        email: credentials.email
    }).then(user => {
        // check password afterwards && user.isValidPassword(credentials.password)
        if(user ){
            res.json({ user: user.toAuthJSON() });
        } else {
            res.status(400).json({
                errors : {
                    global: "Invalid credentials"
                }
            })
        }
    });

});

export default router;
