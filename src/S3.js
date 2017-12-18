import AWS from 'aws-sdk';

// ALL METHODS IN THIS CLASS PRESUME YOU HAVE CREDS SET IN THE GLOBAL `AWS.CONFIG.CREDENTIALS` OBJECT

async function listBucket(bucketName) {
    return new Promise(function(resolve, reject) {
        var s3 = new AWS.S3();
        s3.listObjects({ Bucket: "pi-pics" }, function (err, data) {
            if (err) {
                return reject("Unable to list S3 bucket:", err);
            }
    
            console.log("data", data);
            return resolve(data.Contents.map(cnt => cnt.Key));
        });
    });
}

export default listBucket;