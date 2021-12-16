import express from "express"
const router = express.Router()

import {connection} from "../database/connectSqlite.js"
import {authRateLimiter} from "../security/ratelimiter.js"
import bcrypt from "bcrypt"

router.post("/api/login", authRateLimiter, async (req, res) => {
    const remainingAttempts = req.rateLimit.remaining
    const credentialsToCheck = req.body
    const userCredentials = await connection.get("SELECT username, password FROM users WHERE username = (?)", [credentialsToCheck.username])
    const sessionAuthenticated = req.session.ActionAlleyAuthenticated

    if(userCredentials !== undefined) {
        debugger
        const correctPassword = await bcrypt.compare(credentialsToCheck.password, userCredentials.password)

        if(!correctPassword && remainingAttempts !== 0) {
            return res.sendStatus(401)
        }

        req.session.ActionAlleyAuthenticated = true
        return res.sendStatus(200)
    }

    if(remainingAttempts === 0 && sessionAuthenticated === undefined)
    {
        return res.status(429)
    }

    return res.sendStatus(500)
})

export default router