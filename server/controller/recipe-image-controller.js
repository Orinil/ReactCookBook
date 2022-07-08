const express = require("express");
const router = express.Router();

const busboy = require("busboy");
const CreateAbl = require("../abl/recipe-image/create-abl");
const GetAbl = require("../abl/recipe-image/get-abl");
const UpdateAbl = require("../abl/recipe-image/update-abl");
const DeleteAbl = require("../abl/recipe-image/delete-abl");

router.post("/create", (req,res) => {
  /**
   * busboy config
   * headers - HTTP hlavičky, ty jsou dále parsovány jednotlivými busboy parsery, dle nich busbou spouští eventy (file, field)
   * limits - files: max 1 soubor (obr.), fileSize: max velikost souboru
   * */
  let myBusboy = busboy({ headers: req.headers , limits: {files: 1, fileSize: parseInt(process.env.IMAGE_SIZE_LIMIT)}});
  CreateAbl(myBusboy, res)
  req.pipe(myBusboy);
});

router.post("/edit", (req,res) => {
  let myBusboy = busboy({ headers: req.headers , limits: {files: 1, fileSize: parseInt(process.env.IMAGE_SIZE_LIMIT)}});
  UpdateAbl(myBusboy, res)
  req.pipe(myBusboy);
});

router.get("/get", async (req, res) => {
  await GetAbl(req, res)
});

router.delete("/delete", async (req, res) => {
  await DeleteAbl(req, res)
});

module.exports = router