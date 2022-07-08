const fs = require("fs");
const path = require("path");
const Ajv = require("ajv").default;

const getRecipeImageSchema = {
    "type": "object",
    "properties": {
        "id": { "type": "string" },
    },
    "required": ["id"]
};

async function GetAbl(req, res) {
    // validace vstupu
    const ajv = new Ajv();
    const body = req.query.id ? req.query : req.body;
    const valid = ajv.validate(getRecipeImageSchema, body);

    // nevalidní vstup
    if (!valid) {
        return res.status(400).json({ error: ajv.errors });
    }

    // složení cesty k souboru
    let pathToImage = path.join(__dirname, "..", "..", "storage", body.id + ".png");

    // ověření existence souboru
    try {
        await fs.promises.access(pathToImage, fs.F_OK);
    } catch (e) {
        res.status(400).json(
            { error: `Recipe with code '${body.id}' doesn't not have image yet.` }
        )
    }

    //navrácení souboru (na pozadí se na response přesměruje stream souboru z filesystému)
    res.sendFile(pathToImage);
}

module.exports = GetAbl;