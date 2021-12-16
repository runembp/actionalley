import sqlite3 from "sqlite3"
import { open } from "sqlite"

export let connection

(async () => {
    connection = await open( {
        filename: "./database/database.db",
        driver: sqlite3.Database
    })
})()