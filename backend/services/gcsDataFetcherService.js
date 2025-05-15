const { Storage } = require("@google-cloud/storage");

const getJsonFromGCS = async (gcsLink) => {
  try {
    const regex = /^gs:\/\/([^/]+)\/(.+)$/;
    const match = gcsLink.match(regex);

    if (!match) {
      throw new Error("Invalid GCS URL format");
    }

    const bucketName = match[1];
    const fileName = match[2];

    const storage = new Storage();
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    const [fileData] = await file.download();

    return JSON.parse(fileData.toString("utf-8"));
  } catch (err) {
    console.error("Error retrieving JSON from GCS:", err);
    throw new Error("Error retrieving JSON from GCS");
  }
};

module.exports = getJsonFromGCS;
