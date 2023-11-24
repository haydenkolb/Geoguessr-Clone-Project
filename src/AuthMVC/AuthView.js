class AuthView {
    constructor() {
        this.submitTypeInput = document.getElementById('submit-type');
        this.signInForm = document.getElementById('sign-in-form');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');

        document.getElementById('sign-in-button').addEventListener('click', () => {
            this.submitTypeInput.value = 'sign-in';
          });
        document.getElementById('register-button').addEventListener('click', () => {
            this.submitTypeInput.value = 'register';
        });
    }

    bindSubmitForm = (handlerSignIn, handlerRegister) => {
        this.signInForm.addEventListener('submit', (e) => {
            // Preventing page refresh
            e.preventDefault();

            if (this.submitTypeInput.value === 'sign-in') {
                handlerSignIn(this.emailInput.value,this.passwordInput.value)
            } else if (this.submitTypeInput.value === 'register') {
                handlerRegister(this.emailInput.value,this.passwordInput.value)
            }
        })
    }

    hideForm = () => {
        this.signInForm.style.display = 'none';
    }

}

export { AuthView }