const common = require("oci-common");
const OS = require("oci-objectstorage")

/***
 * @returns {common.SimpleAuthenticationDetailsProvider} OCI Auth Details Provider
 ***/
function getProvider(settings){
    return new common.SimpleAuthenticationDetailsProvider(
        settings.tenancyId,     settings.userId,
        settings.fingerprint,   settings.privateKey,
        null,                   settings.region
    );
}

/***
 * @returns {OS.ObjectStorageClient} OCI Database Client
 ***/
function getOSClient(settings){
    const provider = getProvider(settings);
    return new OS.ObjectStorageClient({
      authenticationDetailsProvider: provider
    });
}
  
module.exports = {
    getProvider,
    getOSClient
}