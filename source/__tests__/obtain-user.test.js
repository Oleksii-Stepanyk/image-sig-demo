import {obtainUser} from "../obtain-user.js";

describe('obtainUser', () => {
    const valid_user = "user";
    const invalid_user = "invalid_user";
    const valid_password = "pass";
    const invalid_password = "invalid_password";

    describe('when the user and pass is valid', () => {
        it('should return the user', () => {
            const user = obtainUser(valid_user, valid_password)
            const result = new Promise((resolve, reject) => {
                resolve({login: valid_user, password: valid_password})
            })
            expect(user).toEqual(result)
        })
    })

    describe('when the user is invalid', () => {
        it('should return an empty promise', () => {
            const user = obtainUser(invalid_user, valid_password)
            const result = new Promise((resolve, reject) => {
                resolve({})
            })
            expect(user).toEqual(result)
        })
    })

    describe('when the password is invalid', () => {
        it('should return an empty promise', () => {
            const user = obtainUser(valid_user, invalid_password)
            const result = new Promise((resolve, reject) => {
                resolve({})
            })
            expect(user).toEqual(result)
        })
    })

    describe('when the user and password is invalid', () => {
        it('should return an empty promise', () => {
            const user = obtainUser(valid_user, invalid_password)
            const result = new Promise((resolve, reject) => {
                resolve({})
            })
            expect(user).toEqual(result)
        })
    })
})