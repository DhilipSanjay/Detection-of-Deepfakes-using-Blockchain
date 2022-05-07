import { create } from 'ipfs-http-client' ;
import config from '../config/config.json';

const ipfs = create({ host: config.ipfs_host, port: '5001', protocol: 'https' })

export default ipfs;