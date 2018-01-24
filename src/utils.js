

/**
 * In the most safe possible manner, retrieves a human presentable string from 
 * an object that might be ... anything.
 * 
 * @returns a string
 */
export function safelyGetErrorMessage(err) {

    if (!err) {
        return "Error not present. Error Code: 19";
    }

    // Try to get a message from the error
    if ('undefined' !== typeof(err.message) &&
        err.message.length > 2) {
        return err.message;
    }

    if (typeof(err) === 'string') {
        return err;
    }

    if (typeof(err) === 'object' &&
        !(err instanceof Error)) {
        return "Object error: " + JSON.stringify(err);
    }

    try { 
        let strErr = JSON.stringify(err);
        if (strErr.length > 2) { // make sure we have some err bits.
            return "Unknown error: " + strErr;
        }
    } catch(unused) { }

    // Grab the first 100 characters of the stack trace...
    if (err instanceof Error && err.stack) {
        return "Unknown trace: " + err.stack.substr(0, 100);
    }

    return "Error not valid.  Error Code: 33";
}

function parseIsJackson(ddbResult) {
    if (!ddbResult.isJackson || !ddbResult.isJackson["N"]) { 
        return "N/A";
    }

    return ddbResult.isJackson["N"] === "1" ? "Yep": "Nope";
}

export function buildSnapshot(ddbResult) {
    return {
        filename: ddbResult.filename["S"],
        humidity: parseFloat(ddbResult.humidity["N"]),
        tempInF: parseFloat(ddbResult.tempInF["N"]),
        date: new Date(ddbResult.date["S"]),
        isJackson: parseIsJackson(ddbResult)
    };
}