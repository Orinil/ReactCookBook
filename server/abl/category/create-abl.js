const path = require("path");
const Ajv = require("ajv").default;
const LibraryDao = require("../../dao/categories-dao");
let dao = new LibraryDao(path.join(__dirname, "..", "..", "storage", "categories.json"));
const { v4: uuidv4 } = require('uuid');


let schema = {
    "type": "object",
    "properties": {
        "name": { "type": "string" },
    },
    "required": ["name"]
};

async function CreateAbl(req, res) {
    try {
        const ajv = new Ajv();
        const valid = ajv.validate(schema, req.body);
        if (valid) {
            let category = req.body;

            category.id = uuidv4();

            const response = await dao.createCategory(category);
            res.json(response);
        } else {
            res.status(400).send({
                errorMessage: "Validation of input failed.",
                params: req.body,
                reason: ajv.errors
            })
        }
    } catch (e) {
        if (e.message.includes("Category with given id ")) {
            res.status(400).send({errorMessage: e.message, params: req.body})
        }
        res.status(500).send(e)
    }
}

module.exports = CreateAbl;
