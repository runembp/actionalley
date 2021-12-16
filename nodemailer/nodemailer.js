import nodemailer from "nodemailer"

export let transporter

(async () => {
    transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
            user: "nodefolio.rbp@gmail.com",
            pass: "verysecurepassword",
        },
    })
})()
