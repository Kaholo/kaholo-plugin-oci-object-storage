const identity = require("oci-identity");
const { getProvider, getOSClient } = require('./helpers');
const parsers = require("./parsers")

// auto complete helper methods

function mapAutoParams(autoParams){
  const params = {};
  autoParams.forEach(param => {
    params[param.name] = parsers.autocomplete(param.value);
  });
  return params;
}

function handleResult(result, query, key){
  let items = result.items || result;
  if (!items || !Array.isArray(items) || items.length === 0) throw result;
  items = items.map(item => ({
    id: key ? item[key] : item.id, 
    value:  key ? item[key] :
            item.displayName ? item.displayName :
            item.name ? item.name : 
            item.id
  }));

  if (!query) return items;
  return items.filter(item => item.value.toLowerCase().includes(query.toLowerCase()));
}
 
// main auto complete methods

async function listCompartments(query, pluginSettings) {
  const settings = mapAutoParams(pluginSettings);
  const tenancyId = settings.tenancyId;
  const provider = getProvider(settings);
  const identityClient = await new identity.IdentityClient({
    authenticationDetailsProvider: provider
  });
  const result = await identityClient.listCompartments({ compartmentId: tenancyId });
  return handleResult(result, query);
}

async function listBuckets(query, pluginSettings, pluginActionParams) {
    /**
     * This method returns all bucket names in the specified compartment
     * Must have compartmentId,availabilityDomain before
     */
    const settings = mapAutoParams(pluginSettings), params = mapAutoParams(pluginActionParams);
    const compartmentId = params.compartment || settings.tenancyId;
    const client = getOSClient(settings);
    let result = await client.listBuckets({
      compartmentId,
      namespaceName: (await client.getNamespace({compartmentId})).value
    });
    if (result.items.length === 0){
      result = await client.listAllBuckets({
        compartmentId,
        namespaceName: (await client.getNamespace({compartmentId})).value
      });
    }
    return handleResult(result, query, "name");
}

async function listObjects(query, pluginSettings, pluginActionParams) {
  /**
   * This method returns all bucket names in the specified compartment
   * Must have compartmentId,availabilityDomain before
   */
  const settings = mapAutoParams(pluginSettings), params = mapAutoParams(pluginActionParams);
  const compartmentId = params.compartment || settings.tenancyId;
  const client = getOSClient(settings);
  const result = await client.listObjects({
    bucketName: params.bucket,
    namespaceName: (await client.getNamespace({compartmentId})).value
  });
  
  return handleResult(result.listObjects.objects, query, "name");
}

module.exports = {
  listCompartments,
  listBuckets,
  listObjects
}
