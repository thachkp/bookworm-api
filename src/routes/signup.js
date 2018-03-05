import User from "../models/User";
import parseErrors from '../utils/parseErrors';
import { sendConfirmationEmail } from "../mailer";


const signUp = async (req, res) => {
    const { email, password } = req.body.user;
    const user = new User({email});
    user.setPassword(password);
    user.setConfirmationToken();

    try {
        await user.save();
        sendConfirmationEmail(user);
        res.json({ user: user.toAuthJSON() })
    } catch (err) {
        res.status(400).json({
            errors: parseErrors(err.errors)
        })
    }
};

export {
    signUp,
};
