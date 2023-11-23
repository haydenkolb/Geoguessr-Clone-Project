import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

class AuthController {
    constructor(view, app, onAuthenticateCallback) {
        this.view = view
        this.auth = getAuth(app);
        this.onAuthenticateCallback = onAuthenticateCallback;

        this.view.bindSubmitForm(this.handleSignIn,this.handleRegister);
    }

    handleSignIn = (email, password) => {
        console.log(this.auth)
        signInWithEmailAndPassword(this.auth, email, password)
        .then(() => this.onAuthenticateCallback())
        .catch((error) => console.log(error.message));
    }

    handleRegister = (email, password) => {
        createUserWithEmailAndPassword(this.auth, email, password)
        .then(() => this.onAuthenticateCallback())
        .catch((error) => console.log(error.message));
    }
}

export {AuthController}