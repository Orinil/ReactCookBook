const path = require("path");
const Ajv = require("ajv").default;
const LibraryDao = require("../../dao/recipes-dao");
let dao = new LibraryDao(path.join(__dirname, "..", "..", "storage", "recipes.json"));
const { v4: uuidv4 } = require('uuid');


let schema = {
    "type": "object",
    "properties": {
        "name": { "type": "string" },
        "desc": { "type": "string" },
        "category": { "type": "string" },
        "prep": { "type": "string" },
        "preptime": { "type": "string" },
        "ingredients": { "type": "array" },
    },
    "required": ["name", "category", "prep", "preptime"]
};

async function CreateAbl(req, res) {
    try {
        const ajv = new Ajv();
        const valid = ajv.validate(schema, req.body);
        if (valid) {
            let recipe = req.body;

            recipe.id = uuidv4();

            const response = await dao.createRecipe(recipe);
            res.status(200).send({
                ...response
            })
        } else {
            res.status(400).send({
                errorMessage: "Validation of input failed.",
                params: req.body,
                reason: ajv.errors
            })
        }
    } catch (e) {
        if (e.message.includes("Recipe with given id ")) {
            res.status(400).send({errorMessage: e.message, params: req.body})
        }
        res.status(500).send(e)
    }
}

module.exports = CreateAbl;
