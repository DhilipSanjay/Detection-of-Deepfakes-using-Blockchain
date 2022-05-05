import { create } from 'ipfs-http-client' 

const ipfs = create({ host: 'localhost', port: '5001', protocol: 'http' })

export default ipfs;