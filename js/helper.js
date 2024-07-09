export const validateName = (name) => {
    return Promise.resolve(name);
}

export const validateUsername = (username) => {
    return Promise.resolve(username);
}

export const validateEmail = (email) => {
    return Promise.resolve(email);
}

export const validatePassword = (password, passwordConfirm) => {
    if (password !== passwordConfirm) {
        return Promise.reject("Passwords do not match.");
    }
    return Promise.resolve(password);
}
