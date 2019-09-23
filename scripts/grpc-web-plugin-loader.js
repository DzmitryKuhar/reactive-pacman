const os = require('os');
const https = require('follow-redirects/https');
const fs = require('fs');

const platform = os.platform();
const gRpcWebVersion = '1.0.5';
const baseLink = `https://github.com/grpc/grpc-web/releases/download/${gRpcWebVersion}/protoc-gen-grpc-web`;
const arch = 'x86_64';
const destinationFile = "./node_modules/.bin/protoc-gen-grpc-web.exe";

let platformName;

switch (platform) {
    case "win32":
        platformName = 'windows';
        break;
    case "darwin":
        platformName = 'darwin';
        break;
    default:
        platformName = 'linux';
}


const file = fs.createWriteStream(destinationFile);
https.get(
    `${baseLink}-${gRpcWebVersion}-${platformName}-${arch}${platform === 'win32' ? '.exe' : ''}`,
    (response) => {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            fs.chmodSync(destinationFile, '755');
            console.log("File has been downloaded");
        });
    })
    .on('error', (e) => {
        fs.unlink(destinationFile);
        console.error("Download failed. ", e);
    });

