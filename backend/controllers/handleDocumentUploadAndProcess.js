const uploadFileToGCS = require("../services/gcsUploadService");
const performOcrOnGcsPdf = require("../services/gcsOcrService");
const getJsonFromGCS = require("../services/gcsDataFetcherService");
const extractInsightsFromText = require("../services/textProcessingService");
const promptGenerator = require("../services/promtGenerator");

const processMultipleDocuments = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded." });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for (const file of req.files) {
      const gcsFileUrl = await uploadFileToGCS(file);
      file.buffer = null;
      console.log("successfully uploaded");

      const ocrOutputGcsUri = await performOcrOnGcsPdf(gcsFileUrl);
      console.log("successfully ocr done");

      const ocrJsonResponse = await getJsonFromGCS(ocrOutputGcsUri);
      console.log("successfully get json from gcs");

      const fullText = ocrJsonResponse?.responses?.[0]?.fullTextAnnotation?.text;

      const prompt = req.body.userPrompt || await promptGenerator(fullText);

      let responseData = {
        fileName: file.originalname,
        prompt 
      };

      if (!fullText) {
        responseData.error = "OCR text not found";
      } else {
        const structuredData = await extractInsightsFromText(fullText, prompt);
        responseData.processedData = structuredData;
      }

      res.write(`data: ${JSON.stringify(responseData)}\n\n`);
    }

    res.write('data: {"message": "Processing complete"}\n\n');
    res.end();
  } catch (err) {
    console.error("Multi-file processing error:", err);
    res.status(500).json({ message: "Error processing files." });
  }
};

module.exports = { processMultipleDocuments };
