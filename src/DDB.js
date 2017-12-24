import AWS from 'aws-sdk';

const tableName = 'pi-pics3';

export async function listMostRecentRecords(maxKeys) {
    const ddb = new AWS.DynamoDB();
    const params = {
        TableName: tableName,
        Select: ddb.ALL_ATTRIBUTES,
        ScanIndexForward: false,
        KeyConditionExpression: "#ps = :partitionkeyval",
        ExpressionAttributeNames: { "#ps": 'picture-set' },
        ExpressionAttributeValues: {
            ':partitionkeyval': {'S' : 'babypi' }
        },
        Limit: maxKeys
    };
    
    return new Promise(function (resolve, reject) {
        ddb.query(params, (err, data) => {
            if (err) { 
                return reject(err); 
            }

            return resolve(data);
        });
    })
}
