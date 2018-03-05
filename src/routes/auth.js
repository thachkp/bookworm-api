import jwt from 'jsonwebtoken';
import User from "../models/User";
import { sendResetPasswordEmail } from '../mailer';

const logIn = async (req, res) => {
    const { credentials } = req.body;

    try {
        const user = await User.findOne({
            email: credentials.email
        });
        if (user.isValidPassword(credentials.password)) 
            res.json({ user: user.toAuthJSON() });
        else {
            res.status(400).json({
                errors : {
                    global: "Invalid credentials"
                }
            });
        }
    } catch (err) {
        res.status(400).json({
            errors : {
                global: "Invalid credentials"
            }
        });
    }
};

const confirmEmail = async (req, res) => {
    const token = req.body.token;
    try {
        const user = await User.findOneAndUpdate(
            {confirmationToken: token},
            {confirmationToken: "", confirmed: true},
            {new: true}
        );
        res.json({
            user: user.toAuthJSON()
        });

    } catch (error) {
        res.status(400).json({})
    }
};

const resetPasswordRequest = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        user.setResetPasswordToken();
        await user.save();

        sendResetPasswordEmail(user);
        res.json({});
    } catch (error) {
        res.status(400).json({ errors: { global: "There is no user with such email"}});
    }
};

const validateToken = async (req, res) => {

    try {
        const decoded = await jwt.verify(req.body.token, process.env.JWT_SECRET);
        const user = await User.findOne({
            _id: decoded._id});
        const valid = user.checkValidResetPasswordToken(req.body.token);

        if(!valid) {
            res.status(401).json({
                errors: {
                    global: "Invalid token"
                }
            });
        } else 
            res.json({});
    } catch (error) {
        res.status(401).json({});

    }
};

const resetPassword = async (req, res) => {
    const { password, token } = req.body.data;

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({
            _id: decoded._id});

        user.setPassword(password);
        await user.save();
        res.json({});

    } catch (error) {
        res.status(401).json({
            errors: {
                global: "Invalid token"
            }
        });
    }
};

export {
    logIn, confirmEmail,
    resetPasswordRequest,
    validateToken, resetPassword
};
