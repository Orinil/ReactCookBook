//načtení modulu express
const express = require("express")
const categoriesRouter = require("./controller/category-controller")
const receiptsRouter = require("./controller/recipes-controller")
const recipeImageRouter = require("./controller/recipe-image-controller")
const cors = require('cors')
const path = require("path")
require('dotenv').config()

//inicializace nového Express.js serveru
const app = express()

app.use(cors())

// Parsování body
app.use(express.json({limit: process.env.MAX_REQUEST_SIZE}))// podpora pro application/json

app.use(express.urlencoded({ extended: true, limit: process.env.MAX_REQUEST_SIZE})) // podpora pro application/x-www-form-urlencoded

app.use("/category", categoriesRouter)

app.use("/recipes", receiptsRouter)

app.use("/image", recipeImageRouter)

app.use(express.static(path.join("storage", "images")))

app.get("/*", (req, res) => {
    res.send('Something else, unknown!')
})

//nastavení portu, na kterém má běžet HTTP server
app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
});
