import sqlite3 from "sqlite3";

export function obtainUser(user, password) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./database.db');
        const query = `SELECT * FROM users WHERE login = '${user}' AND password = '${password}' LIMIT 1`;
        db.get(query, (error, data) => {
            if (error) {
                reject(error);
                return;
            }
            if (!data){
                resolve({});
            }
            return resolve(data);
        })
    })
}