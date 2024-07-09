const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const selectorFormSignup = '#form-signup';
const selectorInputPassword = 'input#password';
const selectorPasswordCriteria = '#passwordCriteria';
const selectorSuccessModal = '#successModal';
const selectorErrorMessage = 'span.error';

const usernameMinLength = 3;
const usernameMaxLength = 64;
const passwordMinLength = 8;
const passwordMaxLength = 64;

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#form-signup');
    const successModal = document.querySelector('#successModal');
    const inputPassword = form.querySelector('#password');
    const passwordCriteria = form.querySelector('#passwordCriteria');
    const submitButton = form.querySelector('button[type="submit"]');

    // Form handler
    form.addEventListener('submit', async e => {
        e.preventDefault();
        clearErrorMessages(form);

        const fields = getFormData(form);
        try {
            const registrationData = await validateInputSignup(fields);
            console.log(registrationData);
            showModal(successModal, registrationData);
        } catch (error) {
            console.log(error);
            displayError(fields[error.field].error, error.message);
        }
    });

    // Input click focus events
    createInputFocusEvents(form);

    // Password criteria checker
    createPasswordEvents(inputPassword, passwordCriteria);

    // Submit button handler
    submitButton.disabled = true;
    form.addEventListener('input', () => {
        checkFormValidity(form, submitButton);
    });
});


/**
 * Validates user input.
 *
 * @param {Object} user - user object.
 * @returns {Promise} - A promise that resolves to an object with the validation results.
 */
const validateInputSignup = async user => {
    await Promise.all([
        validateName(user.name.value),
        validateUsername(user.username.value),
        validateEmail(user.email.value),
        validatePassword(user.password.value, user.passwordConfirm.value),
    ]);

    return {
        name: user.name.value,
        username: user.username.value,
        email: user.email.value,
        password: user.password.value,
    };
};


/**
 *
 * @param {Element} input
 * @param {Element} criteria
 */
const createPasswordEvents = (input, criteria) => {
    input.addEventListener('focus', () => {
        criteria.classList.remove('hidden');
    });

    input.addEventListener('blur', () => {
        criteria.classList.add('hidden');
    });

    input.addEventListener('keyup', () => {
        const result = checkPasswordCriteria(input.value);
        updatePasswordCriteraDisplay(result, criteria);
    });
};

/**
 *
 * @param {*} form
 */
const createInputFocusEvents = form => {
    Array.from(form.querySelectorAll('label')).forEach(label => {
        label.addEventListener('click', e => {
            e.preventDefault();
            const input =
                e.target.nodeName !== 'LABEL'
                    ? e.target.parentNode.querySelector('input')
                    : e.target.querySelector('input');
            input.focus();
        });
    });
};

/**
 *
 * @param {*} form
 * @returns
 */
const getFormData = form => {
    const field = selector => {
        let element = form.querySelector(selector);
        return {
            element: element,
            value: element.value.trim(),
            error: element.parentElement.querySelector('span.error'),
        };
    };
    return {
        name: field('input#name'),
        username: field('input#username'),
        email: field('input#email'),
        password: field('input#password'),
        passwordConfirm: field('input#password-confirm'),
    };
};



/**
 *
 * @param {*} element
 * @param {*} message
 */
const displayError = (element, message) => {
    element.classList.toggle('.hidden');
    element.innerHTML = message;
};

/**
 *
 * @param {Element} modal
 * @param {Object} data
 */
const showModal = (modal, data) => {
    document.getElementById('modalName').textContent = data.name;
    document.getElementById('modalUsername').textContent = data.username;
    document.getElementById('modalEmail').textContent = data.email;

    modal.classList.remove('hidden');
    modal.querySelector('.close').addEventListener('click', () => {
        modal.classList.add('hidden');
    });
};

/**
 *
 * @param {*} id
 */
const closeModal = id => {};

/**
 *
 * @param {*} element
 */
const clearErrorMessages = element => {
    Array.from(element.querySelectorAll('span.error')).forEach(error => {
        error.classList.add('hidden');
        error.innerHTML = '';
    });
};

/**
 *
 * @param {Object} results
 * @param {Element} container
 */
const updatePasswordCriteraDisplay = (results, container) => {
    results.forEach(result => {
        const element = container.querySelector(`#${result.criteria}`);
        result.valid ? element.classList.remove('invalid') : element.classList.add('invalid');
    });
};

/***********************************************************************/

/**
 *
 * @param {string} name
 * @returns
 */
const validateName = name => {
    return new Promise((resolve, reject) => {
        if (!name.match(/^[a-zA-Z ]+$/)) {
            reject('Name must contain only letters and spaces.');
            return;
        }
        resolve(name);
    });
};

/**
 *
 * @param {string} username
 * @returns
 */
const validateUsername = username => {
    return new Promise((resolve, reject) => {
        if (username.length < usernameMinLength || username.length > usernameMaxLength) {
            reject(`Username must be between ${usernameMinLength} and ${usernameMaxLength} characters long.`);
            return;
        }

        if (!/^[a-zA-Z0-9]+$/.test(username)) {
            console.log(username);
            reject('Username must contain only letters and numbers.');
            return;
        }
        resolve(username);
    });
};

/**
 *
 * @param {string} email
 * @returns
 */
const validateEmail = email => {
    return new Promise((resolve, reject) => {
        if (!email.toLowerCase().match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
            reject('Invalid email address.');
        }
        resolve(email.toLowerCase());
    });
};

/**
 *
 * @param {*} password
 * @returns
 */
const validatePassword = password => {
    return new Promise((resolve, reject) => {
        const results = checkPasswordCriteria(password);
        const invalid = results.find(result => !result.valid);
        if (invalid) {
            reject('Password does not meet the criteria.');
            return;
        }
        resolve(password);
    });
};

/**
 *
 * @param {*} password
 * @param {*} passwordConfirm
 * @returns
 */
const validatePasswordConfirm = (password, passwordConfirm) => {
    return new Promise((resolve, reject) => {
        if (password !== passwordConfirm) {
            reject('Passwords do not match.');
            return;
        }
        resolve(password);
    });
};

/**
 *
 * @param {*} password
 * @returns
 */
const checkPasswordCriteria = password => {
    return [
        { criteria: 'lengthCriteria', pattern: /^.{8,64}$/ },
        { criteria: 'upperCaseCriteria', pattern: /[A-Z]/ },
        { criteria: 'lowerCaseCriteria', pattern: /[a-z]/ },
        { criteria: 'specialCharCriteria', pattern: /[!@#$%^&*(),.?":{}|<>]/ },
    ].map(({ criteria, pattern }) => ({ criteria, valid: pattern.test(password) }));
};

/**
 *
 * @param {*} form
 * @param {*} submitButton
 */
const checkFormValidity = (form, submitButton) => {
    const fields = getFormData(form);
    const allFieldsFilled = !Object.values(fields).some(field => !field);
    const password = fields.password.value;
    const passwordConfirm = fields.passwordConfirm.value;
    const passwordValid = checkPasswordCriteria(password).every(result => result.valid);
    const passwordsMatch = password === passwordConfirm;

    if (allFieldsFilled && passwordValid && passwordsMatch) {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
};

/***********************************************************************/
