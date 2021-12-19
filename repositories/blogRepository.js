import express from "express"
import {connection} from "../database/connectSqlite.js"

const router = express.Router()

router.get("/api/blog", async (req, res) => {
    const blogposts = await connection.all("SELECT * FROM blogposts")
    res.send({blogposts})
})

router.post("/api/blog", async (req, res) => {
    if(req.session.ActionAlleyAuthenticated === undefined) {
        return res.sendStatus(401)
    }
    const blogPostToCreate = req.body
    connection.run("INSERT INTO blogposts (title, content, author, created) VALUES (?, ?, ?, ?)",
        [
            blogPostToCreate.title,
            blogPostToCreate.content,
            blogPostToCreate.author,
            blogPostToCreate.created
        ])
    res.sendStatus(200)
})

router.put("/api/blog", async (req, res) => {
    if(req.session.ActionAlleyAuthenticated === undefined) {
        return res.sendStatus(401)
    }
    const blogpostToUpdate = req.body
    connection.run("UPDATE blogposts SET title = (?), content = (?), author = (?) WHERE id = (?)",
        [
            blogpostToUpdate.title,
            blogpostToUpdate.content,
            blogpostToUpdate.author,
            blogpostToUpdate.id
        ])
    res.sendStatus(200)
})

router.delete("/api/blog/:id", async (req, res) => {
    if(req.session.ActionAlleyAuthenticated === undefined) {
        return res.sendStatus(401)
    }
    const blogpostId = req.params.id
    await connection.run("DELETE FROM blogposts WHERE id = (?)", [blogpostId])
    res.sendStatus(200)
})

export default router