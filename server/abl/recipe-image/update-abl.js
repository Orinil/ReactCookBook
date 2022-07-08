const fs = require("fs");
const path = require("path");
const Ajv = require("ajv").default;
const LibraryDao = require("../../dao/recipes-dao");
let dao = new LibraryDao(path.join(__dirname, "..", "..", "storage", "recipes.json"))

const createRecipeImageSchema = {
    "type": "object",
    "properties": {
        "id": {"type": "string"}
    },
    "required": ["id"]
};

async function UpdateAbl(busboy, res) {
    let dtoIn = {};
    let upload_limit = false;
    let oldExt = ""
    let newExt = ""

    // textová část multipartu, ze které složíme vstup naší routy k validaci
    busboy.on("field", function (fieldname, val) {
        dtoIn[fieldname] = val;
    });

    // budeme předpokládat, že soubor se v multipartu uvádí jako poslední pro jednoduchost
    busboy.on("file", async (name, file, info) => {
        const { mimeType } = info;
        newExt = mimeType.split('/').pop()

        // soubor si ukládáme pod id daného receptu pro následné snadné dohledání
        let newTo = path.join(__dirname, "..", "..", "storage", "images", dtoIn.id + `-new.${newExt}`);

        // event - file přesáhne max velikost
        file.on("limit", () => {
            upload_limit = true

            // smazat porušený obrázek (nenahrál se celý)
            fs.unlink(newTo, (err) => {
                res.status(400).json({ error: `Vybraný obrázek je příliš velký (>15MB)` });
            })
        })

        // validace vstupu
        const ajv = new Ajv();
        const valid = ajv.validate(createRecipeImageSchema, dtoIn);

        // nevalidní vstup
        if (!valid) {
            return res.status(400).json({ error: ajv.errors });
        }

        // ověření, že kniha existuje, aby nemohl existovat samotný obrázek
        const recipe = await dao.loadRecipeDetail(dtoIn.id);
        // původní formát obr.
        oldExt = recipe.imageExt

        if (!recipe) {
            return res.status(400).json({ error: `Recipe with id '${dtoIn.id}' doesn't exist.` });
        }

        // omezení, že obrázek musí být ve formátu .png, aby nebylo možné nahrát jiný soubor
        if (mimeType !== "image/png" && mimeType !== "image/jpeg" && mimeType !== "image/jpg") {
            return res.status(400).json({ error: `Only supported mimeType is png, jpg and jpeg` });
        }

        let writeStream = fs.createWriteStream(newTo);
        file.pipe(writeStream);

    });

    // úspěšně se nahrál obrázek
    busboy.on("finish", function () {
        if(!upload_limit) {
            // starý obr.
            let oldImg = path.join(__dirname, "..", "..", "storage", "images", dtoIn.id + `.${oldExt}`);
            // nový dočasný obr.
            let newTempImg = path.join(__dirname, "..", "..", "storage", "images", dtoIn.id + `-new.${newExt}`);
            // finální obr.
            let newFinalImage = path.join(__dirname, "..", "..", "storage", "images", dtoIn.id + `.${newExt}`);

            // smažeme starý obrázek
            fs.unlink(oldImg, (err) => {
                if(err){
                    res.status(400).json({ error: err })
                }
                // přejmenujeme dočasný obr. na finální tvar tj. {idRecptu}.{formát obr.}
                fs.rename(newTempImg, newFinalImage, (err) => {
                    if(err){
                        res.status(400).json({ error: err })
                    }
                    // pokud se změnil formát obr. musíme aktualizovat formát uložený v receptu
                    if(newExt !== oldExt){
                        dao._updateRecipeImageExtension(dtoIn.id, newExt)
                    }
                    res.status(200).json({status: "File succesfully uploaded!"});
                })
            })

        }
    });

    // nastala chyba během přenosu
    busboy.on("error", err => {
        res.status(400).json({ error: err })
    });
}

module.exports = UpdateAbl;