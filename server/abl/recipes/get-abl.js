const path = require("path");
const Ajv = require("ajv").default;
const LibraryDao = require("../../dao/recipes-dao");
let dao = new LibraryDao(path.join(__dirname, "..", "..", "storage", "recipes.json"));
const { v4: uuidv4 } = require('uuid');

let schema = {
    "type": "object",
    "properties": {
        "id": { "type": "string" }
    },
    "required": ["id"]
};

async function GetAbl(req, res) {
    try {
        const ajv = new Ajv();
        const body = req.query.id ? req.query : req.params;
        const valid = ajv.validate(schema, body);

        if (valid) {
            const recipeId = body.id;
            const recipe = await dao.loadRecipeDetail(recipeId);
            if (!recipe) {
                res.status(400).send({error: `Recipe with id '${recipeId}' doesn't exist.`});
            }
            res.json(recipe);
        } else {
            res.status(400).send({
                errorMessage: "Validation of input failed.",
                params: body,
                reason: ajv.errors
            })
        }
    } catch (e) {
        res.status(500).send(e)
    }
}

module.exports = GetAbl;
