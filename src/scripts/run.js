/* eslint-disable no-undef */
const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory(
        'MyEpicGame',
    )
    const gameContract = await gameContractFactory.deploy(
        ['Mike', 'Eleven', 'Dustin', 'Lucas'],
        [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Finn_Wolfhard_by_Gage_Skidmore_2.jpg/466px-Finn_Wolfhard_by_Gage_Skidmore_2.jpg',
            'https://upload.wikimedia.org/wikipedia/en/5/52/Eleven_%28Stranger_Things%29.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Gaten_Matarazzo_by_Gage_Skidmore.jpg/484px-Gaten_Matarazzo_by_Gage_Skidmore.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Caleb_McLaughlin_by_Gage_Skidmore.jpg/442px-Caleb_McLaughlin_by_Gage_Skidmore.jpg',
        ],
        [200, 150, 200, 200],
        [150, 250, 150, 150],
        'Upside Down Monster Thingy', // Boss name
        'https://static1.srcdn.com/wordpress/wp-content/uploads/2019/06/Stranger-Things-Demogorgon-and-Mind-Flayer.jpg', // Boss image
        10000, // Boss hp
        50, // Boss attack damage
    )
    await gameContract.deployed()
    console.log('Contract deployed to:', gameContract.address)

    let txn
    txn = await gameContract.mintCharacterNFT(0)
    await txn.wait()
    console.log('Minted NFT #1')

    // txn = await gameContract.mintCharacterNFT(1);
    // await txn.wait();
    // console.log("Minted NFT #2");

    // txn = await gameContract.mintCharacterNFT(2);
    // await txn.wait();
    // console.log("Minted NFT #3");

    // txn = await gameContract.mintCharacterNFT(3);
    // await txn.wait();
    // console.log("Minted NFT #4");

    txn = await gameContract.attackBoss()
    await txn.wait()

    console.log('Done deploying and minting!')
}

const runMain = async () => {
    try {
        await main()
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

runMain()
