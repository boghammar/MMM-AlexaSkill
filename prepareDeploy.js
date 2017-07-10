/*
 * Script to prepare a deploy on AWS Lambda
 */
console.log("Prepare the AWS Lambda deploy package.")
var fs = require('fs');
var configPath = require('./package.json').alexa.configPath;
console.log("Using configuration path: " + configPath);
var certPath = './certs'
var configFile = configPath + '/deployConfig.js'
var cfg = require(configFile);
console.log("IOTEndpoint: " + cfg.IOTEndpoint);
console.log("certPath: " + cfg.certPath);
console.log("certID: " + cfg.certID);

if (!fs.existsSync(certPath)) {
    fs.mkdirSync(certPath);
}
var certFiles = ['root-CA.crt', 
    cfg.certID+'-certificate.pem.crt', 
    cfg.certID+'-public.pem.key', 
    cfg.certID+'-private.pem.key', 
]
copyFile(configFile, certPath + '/deployConfig.js')

for (var ix = 0 ; ix < certFiles.length; ix++) {
    copyFile(cfg.certPath + '/' + certFiles[ix], certPath + '/' + certFiles[ix])
}


function copyFile(source, target) {
    console.log("Copying "+ source + " => " + target);
    var rd = fs.createReadStream(source);
    var wr = fs.createWriteStream(target);

    rd.pipe(wr);
}