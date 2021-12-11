const IPFS = require('ipfs-api'); //for pulling api which was installed
const ipfs = new IPFS({host: 'ipfs.infura.io', port: 5001, protocol: 'https'}); // new instance 

export default ipfs;
