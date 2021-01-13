
// JavaScript

const os = require("oci-objectstorage");
const common = require("oci-common");
const fs = require("fs");
const { listCompartments } = require('./autocomplete');
const { createOci, createPem, createProvider } = require('./helpers');

async function createBucket(action,settings) {
  return new Promise(async(resolve,reject) => {
    const privateKey = settings.PRIVATE_KEY;
    const userId = settings.USER_ID;
    const tenancyId = settings.TENANCY_ID;
    const fingerPrint = settings.FINGERPRINT;
    const region = settings.REGION;
    const compartmentId = action.params.COMPARTMENT_ID.id ? action.params.COMPARTMENT_ID.id : action.params.COMPARTMENT_ID;
    const bucketName = action.params.BUCKET_NAME;
    await createOci(userId, tenancyId, fingerPrint, region);
    await createPem(privateKey);
    const provider = await createProvider();
    const client = new os.ObjectStorageClient({
      authenticationDetailsProvider: provider
    });
    const nsRequest = {};
    const nsResponse = await client.getNamespace(nsRequest);
    const namespace = nsResponse.value;
    const bucketDetails = {
      name: bucketName,
      compartmentId: compartmentId
    };
    const createBucketRequest = {
      namespaceName: namespace,
      createBucketDetails: bucketDetails
    }
    let createBucketResponse;
    try {
      createBucketResponse = await client.createBucket(createBucketRequest);
    } catch (error) {
      return reject(`exec error: ${error}`);
    }
    return resolve(createBucketResponse);
    
  });
}

async function uploadToBucket(action,settings) {
  return new Promise(async(resolve,reject) => {
    const privateKey = settings.PRIVATE_KEY;
    const userId = settings.USER_ID;
    const tenancyId = settings.TENANCY_ID;
    const fingerPrint = settings.FINGERPRINT;
    const region = settings.REGION;
    const bucketName = action.params.BUCKET_NAME;
    const fileLocation = action.params.FILE_LOCATION;
    const objectName = action.params.OBJECT_NAME;
    await createOci(userId, tenancyId, fingerPrint, region);
    await createPem(privateKey);
    const provider = await createProvider();
    const client = new os.ObjectStorageClient({
      authenticationDetailsProvider: provider
    });
    const stats = fs.statSync(fileLocation);
    const nodeFsBlob = new os.NodeFSBlob(fileLocation, stats.size);
    const objectData = await nodeFsBlob.getData();
    const nsRequest = {};
    const nsResponse = await client.getNamespace(nsRequest);
    const namespace = nsResponse.value;
    const putObjectRequest = {
      namespaceName: namespace,
      bucketName: bucketName,
      putObjectBody: objectData,
      objectName: objectName,
      contentLength: stats.size
    };
    let putObjectResponse;
    try {
      putObjectResponse = await client.putObject(putObjectRequest);
    } catch (error) {
      return reject(`exec error: ${error}`);
    }
    return resolve(putObjectResponse);
  });
}
module.exports = {
  CREATE_BUCKET:createBucket,
  UPLOAD_TO_BUCKET:uploadToBucket,
  //autocomplete
  listCompartments
}

