const { ImageAnnotatorClient } = require("@google-cloud/vision");
const { v4: uuidv4 } = require("uuid");


const client = new ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

// Function to perform OCR on a PDF file stored in GCS
const performOcrOnGcsPdf = async (inputFilelink) => {
  try {
    const uniqueId = uuidv4();
    const inputUri = inputFilelink;
    const outputUri = `gs://ocr_result-data/output/ocr-output-${uniqueId}/`;

    const request = {
      requests: [
        {
          inputConfig: {
            mimeType: "application/pdf",
            gcsSource: {
              uri: inputUri, // Input file in GCS
            },
          },
          features: [{ type: "DOCUMENT_TEXT_DETECTION" }], // OCR feature
          outputConfig: {
            gcsDestination: {
              uri: outputUri, // Output location in GCS
            },
            batchSize: 1, // Number of pages to process in a batch
          },
        },
      ],
    };

    // Run OCR on the PDF
    const [operation] = await client.asyncBatchAnnotateFiles(request);
    await operation.promise();

    // Construct the file URL based on the uniqueId used earlier
    const fileUrl = `gs://ocr_result-data/output/ocr-output-${uniqueId}/output-1-to-1.json`;

    return fileUrl;
  } catch (err) {
    console.error("Error performing OCR:", err);
    throw new Error("Error performing OCR");
  }
};

module.exports = performOcrOnGcsPdf;
