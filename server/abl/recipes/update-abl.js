const path = require("path");
const Ajv = require("ajv").default;
const LibraryDao = require("../../dao/recipes-dao");
let dao = new LibraryDao(path.join(__dirname, "..", "..", "storage", "recipes.json"));
const { v4: uuidv4 } = require('uuid');


let schema = {
    "type": "object",
    "properties": {
        "id": { "type": "string" },
        "name": { "type": "string" },
        "desc": { "type": "string" },
        "category": { "type": "string" },
        "prep": { "type": "string" },
        "preptime": { "type": "string" },
        "ingredients": { "type": "array" },
    },
    "required": ["name", "category", "prep", "preptime"]
};

async function UpdateAbl(req, res) {
    try {
        const ajv = new Ajv();
        let recipe = req.body;

        const valid = ajv.validate(schema, req.body);

        if (valid) {
            recipe = await dao.updateRecipe(recipe)
            if(!recipe){
                return res.status(400).json({ error: `Recipe with given id does not exist` });
            }

            res.status(200).json(recipe);
        } else {
            res.status(400).send({
                errorMessage: "Validation of input failed.",
                params: req.body,
                reason: ajv.errors
            })
        }
    } catch (e) {
        if (e.message.includes("OOOPS, something happened")) {
            res.status(400).send({errorMessage: e.message, params: req.body})
        }
        res.status(500).send(e)
    }
}

module.exports = UpdateAbl;
