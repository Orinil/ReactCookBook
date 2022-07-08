const path = require("path");
const Ajv = require("ajv").default;
const LibraryDao = require("../../dao/categories-dao");
let dao = new LibraryDao(path.join(__dirname, "..", "..", "storage", "categories.json"));
const { v4: uuidv4 } = require('uuid');

//Nastaveni schema na validaci dat (knihovna Avj)
let schema = {
    "type": "object",
    "properties": {
        "name": { "type": "string" },
        "id":{"type": "string"}
    },
    "required": ["name", "id"]
};
//Funkce na updatování názvu kategorie backendu
async function UpdateAbl(req, res) {
    try {
        //Instantiate Ajv validaci
        const ajv = new Ajv();
        //Získáváme kategorii z req parametru funkce
        let category = req.body;
        //Zjišťujeme, jestli má upravovaná kategorie k dispozici jméno a ID (díky Ajv schématu)
        const valid = ajv.validate(schema, req.body);

        if (valid) {
            //Pokud validní je, asynchronně zavoláme updateCategory funkci z categories-dao
            category = await dao.updateCategory(category)
            if (!category) {
                //Pokud nemáme validní kategorii, vrátíme error 400 s chybovou hláškou
                return res.status(400).json({error: `Category with given id does not exist`});
            }
            //Po dokončení updateCategory funkce vrátíme clientovi 200
            res.status(200).json(category);
        } else {
            //Pokud nemáme validní vstupní data (name, id), které kontroluje Avj, client dostane 400
            res.status(400).send({
                errorMessage: "Validation of input failed.",
                params: req.body,
                reason: ajv.errors
            })
        }
    }catch (e) {
        //Generická chybová hláška
        if (e.message.includes("OOOPS, something happened")) {
            res.status(400).send({errorMessage: e.message, params: req.body})
        }
        res.status(500).send(e)
    }
}
//Kam exportujeme
module.exports = UpdateAbl;
