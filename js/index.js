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

    console.log($('input#password'));

    form.addEventListener('submit', e => {
        e.preventDefault();
        clearErrorMessages(form);
        submitFormSignup(e.target);
    });

    createPasswordEvents(inputPassword, passwordCriteria);
    createInputFocusEvents(form);
});



/**
 *
 * @param {*} form
 */
const submitFormSignup = async form => {
    const fields = getFormData(form);

    await validateInputSignup(fields)
        .then(result => {
            console.log(result);
        })
        .catch(error => {
            console.log(error);
            return;
        });
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
 * Validates user input.
 *
 * @param {Object} user - user object.
 * @returns {Promise} - A promise that resolves to an object with the validation results.
 */
const validateInputSignup = async user => {
    console.log(user);

    let result = await Promise.all([
        validateName(user.name.value),
        validateUsername(user.username.value),
        validateEmail(user.email.value),
        validatePassword(user.password.value, user.passwordConfirm.value),
    ]);

    console.log(result);

    return result;
};

const displayError = (element, message) => {
    element.classList.toggle('.hidden');
    element.innerHTML = message;
};

const showModel = id => {};

const closeModal = id => {};

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

        if (!username.match(/^[a-zA-Z0-9]$/)) {
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

/***********************************************************************/
