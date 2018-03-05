import { resetPassword, confirmEmail,
    logIn, resetPasswordRequest, validateToken,
} from "./auth";
import { signUp } from './signup'

const wrap = fn => (...args) => fn(...args).catch(args[2]);

const router = (app) => {
    app.post('/api/auth', wrap(logIn));
    app.post('/api/users', wrap(signUp));
    app.post('/api/auth/confirmation', wrap(confirmEmail));
    app.post('/api/auth/reset_password', wrap(resetPassword));
    app.post('/api/auth/reset_password_request', wrap(resetPasswordRequest));
    app.post('/api/auth/validate_token', wrap(validateToken));
};

export default router;
