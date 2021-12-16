import express from "express"
import path from "path"
import http from "http";
import session from "express-session"
import { Server } from "socket.io";

const app = express()
const server = http.createServer(app)
const __dirname = path.resolve();
const io = new Server(server)

io.sockets.on("connection", function(socket) {
    socket.on("newactivity", () => {
        socket.broadcast.emit("newactivity")
    })
    socket.on("newblogpost", () => {
        socket.broadcast.emit("newblogpost")
    })
})

app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded( {extended: true}))
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/build', express.static(__dirname + '/node_modules/toastr/build'));
app.use('/dist', express.static( __dirname + '/node_modules/jquery/dist'));
app.use('/client-dist', express.static( __dirname + '/node_modules/socket.io/client-dist'));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: "actionalley_supersecuresecret"
}))

import pagesRouter from "./routing/pagesRouter.js"
import loginRepository from "./repositories/loginRepository.js"
import pageRepository from "./repositories/pageRepository.js";
import activityRepository from "./repositories/activityRepository.js";
import blogRepository from "./repositories/blogRepository.js";
import contactRouter from "./routing/contactRouter.js";

app.use(pagesRouter)
app.use(loginRepository)
app.use(pageRepository)
app.use(activityRepository)
app.use(blogRepository)
app.use(contactRouter)

const PORT = process.env.PORT || 8080

server.listen(PORT, (error) => {
  if(error) {
      console.log(`Error happened: ${error}`)
  }
  else {
      console.log(`Server is running at http://localhost:${PORT}`)
  }
})

