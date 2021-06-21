# kaholo-plugin-oci-object-storage
Kaholo integration with Oracle Cloud Infrastracture(OCI) Object storage.

## Settings
1. Private Key (Vault) **Required** - Will be used to authenticate to the OCI API. Can be taken from Identity\Users\YOUR_USER\API keys.
2. User ID (String) **Required** - The OCID of the user to authenticate with.
3. Tenancy ID (String) **Required** - Tenancy OCID. Can be found in user profile.
4. Fingerprint (Vault) **Required** -  Will be used to authenticate to the OCI API. Can be taken from Identity\Users\YOUR_USER\API keys.
5. Region (String) **Required** - Identifier of the region to create the requests in. 

## Method Create bucket
Creates a new object storage bucket in the specified compartment.

### Parameters
1. Compartment (Autocomplete) **Required** - The ID of the compartment to create the new bucket in.
2. Name (String) **Required** - The name of the bucket to create.

## Method Upload To Bucket
Uploads the provided file to the specified bucket.

### Parameters
1. Compartment (Autocomplete) **Required** - The ID of the compartment the bucket is stored at.
2. Bucket (Autocomplete) **Required** - The ID of the bucket to upload the file to.
3. File Path (String) **Required** - The path of the file to upload.
4. Object Name (String) **Required** - The new name of the file to store at the object.

## Method Download From Bucket
Uploads the provided file to the specified bucket.

### Parameters
1. Compartment (Autocomplete) **Required** - The ID of the compartment the bucket is stored at.
2. Bucket (Autocomplete) **Required** - The ID of the bucket to download the file from.
3. Object Name (String) **Required** - The name of the object to download.
4. File Path (Autocomplete) **Required** - The path to store the downloaded object in.
