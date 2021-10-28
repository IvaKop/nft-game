require('@nomiclabs/hardhat-waffle')
require('dotenv').config()

module.exports = {
    solidity: '0.8.0',
    paths: {
        artifacts: './src/artifacts',
    },
    networks: {
        rinkeby: {
            url: process.env.RINKEBY_ALCHEMY_KEY,
            accounts: [process.env.PRIVATE_KEY],
        },
        kovan: {
            url: process.env.KOVAN_ALCHEMY_KEY,
            accounts: [process.env.PRIVATE_KEY],
        },
    },
}
