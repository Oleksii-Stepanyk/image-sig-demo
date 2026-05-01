import {getAuthInfo} from "../get-auth-info.js";
import jwt from "jsonwebtoken";

describe('getAuthInfo', () => {
    const JWT_SECRET = 'SOME_SECRET_HERE'

    const validTocken = jwt.sign({
        id: 1,
        login: 'test@user.com',
    }, JWT_SECRET)

    const expiredTocken = jwt.sign({
        id: 1,
        login: 'test@user.com',
        iat: 1
    }, JWT_SECRET)

    describe('when the token is not expired', () => {
        describe('with Bearer', () => {
            it('should return the unpacked token', () => {
                const info = getAuthInfo('Bearer ' + validTocken, JWT_SECRET)

                expect(info).toEqual({
                    id: 1,
                    login: 'test@user.com',
                    iat: expect.any(Number),
                })
            })
        })
        describe('without Bearer', () => {
            it('should throw an error', () => {
                expect(() => getAuthInfo(validTocken, JWT_SECRET)).toThrow('Invalid authorization header')
            })
        })
    })

    describe('when the token is not provided', () => {
        describe('with Bearer', () => {
            it('should throw an error', () => {
                expect(() => getAuthInfo('Bearer', JWT_SECRET)).toThrow(expect.any(Error))
            })
        })
        describe('without Bearer', () => {
            it('should throw an error', () => {
                expect(() => getAuthInfo('', JWT_SECRET)).toThrow('Invalid authorization header')
            })
        })
    })

    describe('when the token is expired', () => {
        it('should throw an error', () => {
            expect(() => getAuthInfo('Bearer ' + expiredTocken, JWT_SECRET)).toThrow('The token has expired')
        })
    })

    describe('when the token is invalid', () => {
        it('should throw an error', () => {
            expect(() => getAuthInfo('Bearer some string which is no a token', JWT_SECRET)).toThrow(expect.any(Error))
        })
    })
})