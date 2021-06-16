const fs = require("fs");
const { getOSClient } = require('./helpers');
const parsers = require("./parsers");

async function createBucket(action, settings) {
  const client = getOSClient(settings);
  const compartmentId = parsers.autocomplete(action.params.compartment || settings.tenancyId);
  const namespace = await client.getNamespace({compartmentId});
  return client.createBucket({
    namespaceName: namespace.value,
    createBucketDetails: {
      compartmentId,
      name: parsers.string(action.params.name)
    }
  });
}

async function uploadToBucket(action,settings) {
  const client = getOSClient(settings);
  const filePath = parsers.string(action.params.filePath);
  const namespace = await client.getNamespace({
    compartmentId: parsers.autocomplete(action.params.compartment || settings.tenancyId)
  });
  return client.putObject({
    bucketName: parsers.autocomplete(action.params.bucket),
    namespaceName: namespace.value,
    objectName: parsers.string(action.params.objectName),
    contentLength: fs.statSync(filePath).size,
    putObjectBody: fs.createReadStream(filePath)
  });
}

async function downloadFromBucket(action,settings) {
  const client = getOSClient(settings);
  const filePath = parsers.string(action.params.filePath);
  const namespace = await client.getNamespace({
    compartmentId: parsers.autocomplete(action.params.compartment|| settings.tenancyId)
  });
  const result = await client.getObject({
    bucketName: parsers.autocomplete(action.params.bucket),
    namespaceName: namespace.value,
    objectName: parsers.autocomplete(action.params.object)
  });
  const writable = fs.createWriteStream(filePath);
  result.value.pipe(writable);
  return result;
}

module.exports = {
  createBucket,
  uploadToBucket,
  downloadFromBucket,
  ...require("./autocomplete")
}

