const { Storage } = require("@google-cloud/storage");
const { v4: uuidv4 } = require("uuid");


// Initialize Google Cloud Storage client
const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const bucketName = 'ocr_result-data';
const bucket = storage.bucket(bucketName);

// function to upload a file to Google Cloud Storage
const uploadFileToGCS = async (file) => {
  try {
    if (!file || !file.buffer) {
      throw new Error("File buffer is empty");
    }

    const fileName = `pdf/${uuidv4()}-${file.originalname}`;
    const fileUpload = bucket.file(fileName);
    const fileStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype || "application/octet-stream",
      },
    });

    return new Promise((resolve, reject) => {
      fileStream.on("error", (err) => {
        console.error("Error uploading file to GCS:", err);
        reject(new Error("Error uploading file to GCS"));
      });

      fileStream.on("finish", () => {
        const fileUrl = `gs://${bucketName}/${fileName}`;
        resolve(fileUrl); // Return the GCS file URL
      });

      // Ensure file buffer is properly piped
      fileStream.end(file.buffer); // This should write the content to the stream
    });
  } catch (err) {
    console.error("Error in file upload:", err);
    throw new Error("Server error");
  }
};

module.exports =  uploadFileToGCS;
