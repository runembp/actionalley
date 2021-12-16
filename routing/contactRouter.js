import express from "express"
const router = express.Router()

import {transporter} from "../nodemailer/nodemailer.js";

router.post("/api/contact", async (req, res) => {
    const message = req.body
    const accountEmail = '"ActionAlley" <nodefolio.rbp@gmail.com>'
    const emailSubject = "new Action Alley Contact Form Message"
    const emailHtmlBody =
        `
            <h3>Message from Action Alley Contact Form:</h3>
            <p><b>From: </b> ${message.name} </p>
            <p><b>Email: </b> ${message.email} </p>
            <p><b>Telephone: </b> ${message.telephone} </p>
            <p>
                <b>Message: </b> 
                </br>
                ${message.message} 
            </p>
        `

    await transporter.sendMail({
        from: accountEmail,
        to: accountEmail,
        subject: emailSubject,
        text: message.message,
        html: emailHtmlBody
    });

    res.sendStatus(200)
})

export default router