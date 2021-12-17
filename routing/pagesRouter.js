import express from "express"
const router = express.Router()

import pageRender from "../page_render.js"

const frontpagePage = pageRender("frontpage/frontpage.html", {
    title: "Action Alley | Welcome!"
})

const activityPage = pageRender("activities/activities.html", {
    title: "Action Alley | Browse our activities!"
})

const contactPage = pageRender("contact/contact.html", {
    title: "Action Alley | Contact Action Alley"
})

const blogPage = pageRender("blog/blog.html", {
    title: "Action Alley | Blog posts from our staff"
})

const loginPage = pageRender("login/login.html", {
    title: "Action Alley | Staff section"
})
const adminPage = pageRender("admin/admin.html")
const unAuthorizedPage = pageRender("unauthorized/unauthorized.html", {
    title: "Action Alley | Unauthorized"
})

router.get("/", (req, res) => {
    res.send(frontpagePage)
})

router.get("/activities", (req, res) => {
    res.send(activityPage)
})

router.get("/contact", (req, res) => {
    res.send(contactPage)
})

router.get("/blog", (req, res) => {
    res.send(blogPage)
})

router.get("/login", (req, res) => {
    if(req.session.ActionAlleyAuthenticated === true)
    {
        res.send(adminPage)
        return
    }
    res.send(loginPage)
})

router.get("/admin", (req, res) => {
    // if(req.session.ActionAlleyAuthenticated === undefined)
    // {
    //     res.send(unAuthorizedPage)
    //     return
    // }
    res.send(adminPage)
})

router.get("/logout", (req, res) => {
    req.session.destroy()
    res.send(frontpagePage)
})

export default router
