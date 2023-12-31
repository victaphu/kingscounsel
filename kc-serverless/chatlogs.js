const CovalentClient = require("@covalenthq/client-sdk");
require("dotenv").config({
  path: '.env.polygon', override: true
})

const ApiServices = async () => {
    const client = new CovalentClient(process.env.COVALENT_API);
    try {
        for await (const resp of client.BaseService.getLogEventsByAddress("matic-mainnet","0x37f0e411b5B342D3Db5Bd72814FC649CaBa5D474", {"startingBlock": 50417984,"pageSize": 300})) {
            console.log(resp);

        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports.run = ApiServices;