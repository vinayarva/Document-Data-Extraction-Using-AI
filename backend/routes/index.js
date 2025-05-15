const express = require("express");
const { uploadMultiple } = require("../middleware/multer");
const { processMultipleDocuments } = require("../controllers/handleDocumentUploadAndProcess");

const route = express.Router();

route.post("/", uploadMultiple, processMultipleDocuments);

module.exports = route;
