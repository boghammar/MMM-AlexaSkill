/*
 * Script to prepare a deploy on AWS Lambda
 */
var fs = require('fs');
var path = require('path');
var zip = require('node-zip');

console.log("Prepare the AWS Lambda deploy package.")
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

var count = 0;
var zipper = new zip();
var allfiles = [];

// -------------- Add secret files pointed to by the deployConfig.js
allfiles.push({source: configFile, target: path.join(certPath, 'deployConfig.js')});

var certFiles = ['root-CA.crt', 
    cfg.certID+'-certificate.pem.crt', 
    cfg.certID+'-public.pem.key', 
    cfg.certID+'-private.pem.key', 
]
for (var ix = 0 ; ix < certFiles.length; ix++) {
    allfiles.push({source: path.join(cfg.certPath, certFiles[ix]), target: path.join(certPath, certFiles[ix])});
}

// -------------- Add sourcefiles and node_modules
allfiles.push({source: 'index.js', target: 'index.js'});
allfiles.push({source: 'iotgateway.js', target: 'iotgateway.js'});
allfiles.push({source: 'package.json', target: 'package.json'});
allfiles.push({source: 'node_modules', target: 'node_modules'});

console.log(" Zipping " + allfiles.length + " files");

for (var ix = 0; ix < allfiles.length; ix++) {
    var cc = ix;
    copyAndZip(allfiles[ix], function(file, err) {
        console.log("Done with "+file.target);
        if (err) {
            console.error("********** Problems with "+file.source + ": " + err.message);
            return;
        }
        if (count == 0) {
            var zipfileName = 'deploy.zip';
            console.log("Zipping "+ zipfileName);
            var data = zipper.generate({ base64:false, compression: 'DEFLATE' });
            fs.writeFileSync(zipfileName, data, 'binary');
        }
    });
}

function copyAndZip(file, cb) {
    count++;
    console.log("CopyZip "+ file.source + " => " + file.target + " "+count);
    if (!fs.existsSync(file.source)) {
        cb(file, new Error("File "+ file.source + " does not exist."));
        return;
    }
    copyFile(file.source, file.target, function(err) {
        if (err) cb(file, err);
        else {
            addFile(file.target);
            count--;
            cb(file);
        }
    });
}

function addFile(filePath) {
    if (fs.lstatSync(filePath).isDirectory()) {
        console.log("Zipping folder "+ filePath);
        zipper.folder(filePath);
        var directory = fs.readdirSync(filePath);
        directory.forEach(function(subfilepath) {
            var filename = path.join(filePath,subfilepath);
            console.log("           Zipping file "+ filename);
            addFile(filename);
        });
    } else {
        zipper.file(filePath, fs.readFileSync(filePath));
    }
}

function copyFile(source, target, cb) {
    var cbCalled = false;

    if (source == target) {done(); return;}

    console.log("Copying "+ source + " => " + target);
    var rd = fs.createReadStream(source);
    rd.on("error", function(err) {
        done(err);
    });
    var wr = fs.createWriteStream(target);
    wr.on("error", function(err) {
        done(err);
    });
    wr.on("close", function(ex) {
        done();
    });

    rd.pipe(wr);

    function done(err) {
        if (!cbCalled) {
            cb(err);
            cbCalled = true;
        }
    }
}

