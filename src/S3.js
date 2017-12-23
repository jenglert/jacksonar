import AWS from 'aws-sdk';

// ALL METHODS IN THIS CLASS PRESUME YOU HAVE CREDS SET IN THE GLOBAL `AWS.CONFIG.CREDENTIALS` OBJECT

const bucketName = "pi-pics";

export async function listBucket(maxKeys) {
    return new Promise(function(resolve, reject) {
        var s3 = new AWS.S3();
        s3.listObjectsV2({ Bucket: bucketName, MaxKeys: maxKeys }, function (err, data) {
            if (err) {
                return reject("Unable to list S3 bucket:", err);
            }
    
            console.log("data", data);
            return resolve(data.Contents.map(cnt => cnt.Key));
        });
    });
}

export async function getObjectData(key) { 
    return new Promise(function(resolve, reject) {
        var s3 = new AWS.S3();
        s3.getObject({ Bucket: bucketName, Key:  key}, function (err, resp) {
            if (err) {
                return reject("Unable to get object key " + key + " :", err);
            }
    
            return resolve(resp.Body);
        });
    });
}

export default { listBucket, getObjectData };