import express from "express"
import {connection} from "../database/connectSqlite.js"

const router = express.Router()

router.get("/api/activities", async (req, res) => {
    const activityList = await connection.all("SELECT * FROM activities")
    res.send({activityList})
})

router.post("/api/activities", async (req, res) => {
    if(req.session.ActionAlleyAuthenticated === undefined) {
        return res.sendStatus(401)
    }
    const activityToCreate = req.body
    connection.run("INSERT INTO activities (title, description, image) VALUES (?, ?, ?)",
        [
            activityToCreate.title,
            activityToCreate.description,
            activityToCreate.image
        ])
    res.sendStatus(200)
})

router.patch("/api/activities", async (req, res) => {
    if(req.session.ActionAlleyAuthenticated === undefined) {
        return res.sendStatus(401)
    }
    const activityToBeSaved = req.body
    await connection.run("UPDATE activities SET title = (?), description = (?), image = (?) WHERE id = (?)",
        [
            activityToBeSaved.title,
            activityToBeSaved.description,
            activityToBeSaved.image,
            activityToBeSaved.id
        ])
    res.sendStatus(200)
})

router.delete("/api/activities/:id", async (req, res) => {
    if(req.session.ActionAlleyAuthenticated === undefined) {
        return res.sendStatus(401)
    }
    const activityId = req.params.id
    await connection.run("DELETE FROM activities WHERE id = (?)", [activityId])
    res.sendStatus(200)
})

export default router