import express from "express"
import {connection} from "../database/connectSqlite.js"

const router = express.Router()

router.get("/api/pages/:pageName",  async (req, res) => {
    const pageName = req.params.pageName
    const pageNameLowercase = pageName.toLowerCase()
    const pageContent = await connection.get("SELECT pagecontent FROM pages WHERE pagename = (?)", [pageNameLowercase])

    res.send({pageContent})
})

router.patch("/api/pages", async (req, res) => {
    if(req.session.ActionAlleyAuthenticated === undefined) {
        return res.sendStatus(401)
    }
    const pageName = req.body.pagename.toLowerCase()
    const pageContent = req.body.pagecontent

    connection.run("UPDATE pages SET pagecontent = (?) WHERE pagename = (?)", [pageContent, pageName])

    res.sendStatus(200)
})

export default router
