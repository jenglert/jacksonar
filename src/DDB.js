import AWS from 'aws-sdk';

const tableName = 'pi-pics3';

export async function listMostRecentRecords(maxKeys, pageDate) {
    const ddb = new AWS.DynamoDB();

    if (!pageDate) {
        pageDate = new Date(2050, 1, 1);
    }

    let params = {
        TableName: tableName,
        Select: ddb.ALL_ATTRIBUTES,
        ScanIndexForward: false,
        KeyConditionExpression: "#ps = :partitionkeyval and #sk < :sortkeyval",
        ExpressionAttributeNames: { '#ps': 'picture-set' , '#sk': 'date'},
        ExpressionAttributeValues: {
            ':partitionkeyval': {'S' : 'babypi' },
            ':sortkeyval': {'S': pageDate.toISOString()}
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

export async function getRecordDetails(filename) {
     const ddb = new AWS.DynamoDB();

     let params = {
        TableName: tableName,
        IndexName: 'filename-index',
        Select: ddb.ALL_ATTRIBUTES,
        KeyConditionExpression: "#fn = :v_filename",
        ExpressionAttributeNames: { '#fn': 'filename'},
        ExpressionAttributeValues: {
            ':v_filename': {'S' : filename }
        },
        Limit: 1
    };

     return new Promise(function(resolve, reject) {
        ddb.query(params, function(err, data) {
            if (err) {
                reject(err);
            }

            return resolve(data);
        });
     });
}   
