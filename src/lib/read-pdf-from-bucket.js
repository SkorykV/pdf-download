const AWS = require('aws-sdk');

const S3 = new AWS.S3();

async function readPdfFromBucket(key) {
  return S3.getObject({
    Bucket: process.env.PDF_BUCKET_NAME,
    Key: key,
  }).promise();
}

module.exports.readPdfFromBucket = readPdfFromBucket;
