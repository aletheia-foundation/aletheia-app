const child_process = require('child_process');
const fs = require('fs');

const devPath = ".ipfs-develop";
const ipfsExecutable = './node_modules/go-ipfs-dep/go-ipfs/ipfs';
let isWin = /^win/.test(process.platform);

let shell = (cmd, callback) => {
  let child = child_process.exec(cmd, callback);
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
  process.stdin.pipe(child.stdin);
}

let runIpfs = () => {
  shell (`${ipfsExecutable} daemon -c ${devPath}`);
}

let initDev = !fs.existsSync(devPath);

if(initDev) {
  shell (`${ipfsExecutable} init -c ${devPath}`, (err, stdout, stderr) => {
    if(!err) runIpfs();
  });
} else {
  runIpfs();
}

