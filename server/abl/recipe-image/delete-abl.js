const path = require("path");
const Ajv = require("ajv").default;
const LibraryDao = require("../../dao/images-dao");
let dao = new LibraryDao(path.join(__dirname, "..", "..", "storage", "images"))

let schema = {
    "type": "object",
    "properties": {
        "id": { "type": "string"},
        "ext": { "type": "string"}
    },
    "required": ["id"]
};

async function DeleteAbl(req, res) {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);
    try {
        if (valid) {
            const image = req.body;
            await dao.deleteImage(image);
            res.status(200).json({});
        } else {
            res.status(400).send({
                errorMessage: "Validation of input failed.",
                params: req.body,
                reason: ajv.errors
            })
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
}

module.exports = DeleteAbl;
