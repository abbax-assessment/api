const AWSXRay = require('aws-xray-sdk');

if (process.env.ENVIRONMENT !== "local") {
    AWSXRay.captureAWS(require("aws-sdk"));
    AWSXRay.captureHTTPsGlobal(require("http"));
    AWSXRay.captureHTTPsGlobal(require("https"));
}  

function getXray() {
    if (process.env.ENVIRONMENT !== "local") {
        return AWSXRay;
    }   

    return undefined;
}

module.exports = getXray;