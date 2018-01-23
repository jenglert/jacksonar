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
        ExpressionAttributeNames: { '#ps': 'picture-set', '#sk': 'date' },
        ExpressionAttributeValues: {
            ':partitionkeyval': { 'S': 'babypi' },
            ':sortkeyval': { 'S': pageDate.toISOString() }
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
        ExpressionAttributeNames: { '#fn': 'filename' },
        ExpressionAttributeValues: {
            ':v_filename': { 'S': filename }
        },
        Limit: 1
    };

    return new Promise(function (resolve, reject) {
        ddb.query(params, function (err, data) {
            if (err) {
                return reject(err);
            }

            return resolve(data);
        });
    });
}

export async function markIsJackson(date, isJackson) {
    const ddb = new AWS.DynamoDB();

    var params = {
        ExpressionAttributeNames: {
            "#ij": "isJackson",
        },
        ExpressionAttributeValues: {
            ":b": {
                N: isJackson ? "1" : "0"
            }
        },
        Key: {
            "picture-set": {
                S: 'babypi',
            },
            "date": {
                S: date
            }
        },
        ReturnValues: "ALL_NEW",
        TableName: tableName,
        UpdateExpression: "SET #ij = :b"
    };

    return new Promise(function (resolve, reject) {
        ddb.updateItem(params, function(err, data) {
            if (err) {
                return reject(err);
            }

            return resolve(data);
        });
    });
}

export async function scanNext(date, backwards = false) {
    const ddb = new AWS.DynamoDB();

    var params = {
        TableName: tableName,
        ExpressionAttributeNames: {
            "#PS" : "picture-set",
            "#DA" : "date",
        },
        ExpressionAttributeValues: {
            ":d" : {
                "S": date
            },
            ":ps" : {
                "S": "babypi"
            }
        },
        KeyConditionExpression: "#DA " + (backwards ? "<" : ">") + " :d  AND #PS = :ps",
        ScanIndexForward: backwards ? false : true,
        Limit: 1 
    }; 

    return new Promise(function (resolve, reject) {
        ddb.query(params, function(err, data) {
            if (err) { 
                return reject(err);
            }

            if (data.Items.length === 0) {
                return reject("No more records");
            }

            return resolve(data.Items[0].filename.S);
        });
    });
}
