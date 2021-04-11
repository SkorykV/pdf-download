const zlib = require('zlib');
const { promisify } = require('util');
const { readPdfFromBucket } = require('../lib/read-pdf-from-bucket');

const gzipPromisified = promisify(zlib.gzip);

module.exports.getPdf = async event => {
  if (!event.pathParameters || !event.pathParameters.name) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'specify pdf file name',
      }),
    };
  }

  const filename = event.pathParameters.name;

  try {
    const s3Object = await readPdfFromBucket(filename);

    const gzippedContent = await gzipPromisified(s3Object.Body);

    console.log('Initial size:', s3Object.ContentLength);
    console.log('Gzipped size', gzippedContent.length);

    return {
      isBase64Encoded: true,
      statusCode: 200,
      body: gzippedContent.toString('base64'),
      headers: {
        'Content-Type': s3Object.ContentType,
        'Content-Encoding': 'gzip',
      },
    };
  } catch (e) {
    return {
      statusCode: 200,
      body: JSON.stringify({ error: `File "${filename}" was not found` }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
