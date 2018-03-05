import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import uniqueValidator from 'mongoose-unique-validator';


const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        index: true,
        unique: true
    },
    passwordHash: {
        type: String, 
        required: true
    },
    confirmed: {
        type: Boolean,
        default: false

    },
    confirmationToken: {
        type: String,
        default: ""
    },
    resetPasswordToken: {
        type: String,
        default: undefined
    }
}, {timestamps: true})

schema.methods.isValidPassword = function isValidPassword(password) {
    return bcrypt.compareSync(password, this.passwordHash);
}

schema.methods.setPassword = function setPassword(password){
    this.passwordHash = bcrypt.hashSync(password, 10);
}

schema.methods.setConfirmationToken = function setConfirmationToken(){
    this.confirmationToken = this.generateJWT();
}

schema.methods.setResetPasswordToken = function setResetPasswordToken(){
    if (this.resetPasswordToken) {
        jwt.decode(this.resetPasswordToken, process.env.JWT_SECRET, (err) => {
            if ( err ) 
                this.resetPasswordToken = this.generateResetPasswordToken();
        });
    } else {
        this.resetPasswordToken = this.generateResetPasswordToken();
    }
}

schema.methods.checkValidResetPasswordToken = function checkValidResetPasswordToken(token){
    return this.resetPasswordToken === token;
}

schema.methods.generateConfirmationUrl = function generateConfirmationUrl(){
    return `${process.env.HOST}/confirmation/${this.confirmationToken}`;
}

schema.methods.generateResetPasswordUrl = function generateResetPasswordUrl(){
    return `${process.env.HOST}/reset_password/${this.resetPasswordToken}`;
}

schema.methods.generateJWT = function generateJWT() {
    return jwt.sign(
        {
            email: this.email,
            confirm: this.confirm
        }, 
        process.env.JWT_SECRET
    );
};

schema.methods.generateResetPasswordToken = function generateResetPasswordToken() {
    return jwt.sign(
        {
            _id: this._id
        }, 
        process.env.JWT_SECRET,
        { expiresIn: "1h"}
    );
};

schema.methods.toAuthJSON = function toAuthJSON() {
    return {
        email: this.email,
        confirmed: this.confirmed,
        token: this.generateJWT()
    }
};

schema.plugin(uniqueValidator, { message : "this email is alleredy taken"});

export default mongoose.model('User', schema);
