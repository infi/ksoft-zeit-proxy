const express = require("express")
const app = express()

const fetch = require("make-fetch-happen")

const buildQuery = (queryObject) => {
    let string = ""
    Object.keys(queryObject).forEach(qParam => {
        if (string.length === 0) string += "?"
        else string += "&"
        string += `${qParam}=${queryObject[qParam]}`
    })
    return string
}

const base = "https://api.ksoft.si"

const buildUrlFromBase = (r, q) => `${base}${r}${q}`

/**
 * @param {express.Request} req
 */
const requireAuthHeader = (req) => {
    if (!req.header("Authorization")) return false
    if (req.header("Authorization").split(" ").length !== 2) return false
    return true
}

const err = (m) => {
    return {
        error: m
    }
}

app.use((require("cors"))())

// TODO: Make this work
app.get("/images/random-image", (req, res) => {
    if (!requireAuthHeader(req)) return res.json(err("Invalid auth header"))
    fetch(`${buildUrlFromBase("/images/random-image", buildQuery(req.query))}`)
        .then(r => r.json().then(p => {
            res.status(r.status).send(p)
        }))
        .catch(e => {
            res.json({ internalError: e })
        })
})

app.use((req, res) => res.json(err(404)))

const port = process.env.PORT || 3030

app.listen(port, () => {
    console.log("Listening on " + port)
})