import express from "express";
const router = express.Router()

import {connection} from "../database/connectSqlite.js";

router.post("/api/login", async (req, res) => {

    const credentialsToCheck = req.body
    const credentialsStored = await connection.get("SELECT username, password FROM users WHERE username = (?) AND password = (?)",
        [
            credentialsToCheck.username,
            credentialsToCheck.password
        ])

    if(credentialsStored !== undefined) {
        req.session.ActionAlleyAuthenticated = true

    }

    res.send(credentialsStored)
})

export default router