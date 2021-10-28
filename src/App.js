import React, { useEffect, useState } from 'react'
import SelectCharacter from './Components/SelectCharacter'
import Arena from './Components/Arena'
import LoadingIndicator from './Components/LoadingIndicator'
import { ethers } from 'ethers'
import './App.css'

import myNFTGame from './artifacts/contracts/NFTGame.sol/MyEpicGame.json'
import { transformCharacterData } from './utils'

const App = () => {
    const [currentAccount, setCurrentAccount] = useState(null)
    const [characterNFT, setCharacterNFT] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const checkIfWalletIsConnected = async () => {
            try {
                const { ethereum } = window

                if (!ethereum) {
                    console.log('Make sure you have MetaMask!')
                    return
                } else {
                    console.log('We have the ethereum object', ethereum)
                    const accounts = await ethereum.request({
                        method: 'eth_accounts',
                    })
                    if (accounts.length !== 0) {
                        const account = accounts[0]
                        console.log('Found an authorized account:', account)
                        setCurrentAccount(account)
                    } else {
                        console.log('No authorized account found')
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
        setIsLoading(true)
        checkIfWalletIsConnected()
    }, [])

    useEffect(() => {
        /*
         * The function we will call that interacts with out smart contract
         */
        const fetchNFTMetadata = async () => {
            console.log(
                'Checking for Character NFT on address:',
                currentAccount,
            )

            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const gameContract = new ethers.Contract(
                process.env.REACT_APP_CONTRACT,
                myNFTGame.abi,
                signer,
            )
            const txn = await gameContract.checkIfUserHasNFT()
            if (txn.name) {
                console.log('User has character NFT')
                setCharacterNFT(transformCharacterData(txn))
            } else {
                console.log('No character NFT found!')
            }
        }

        if (currentAccount) {
            console.log('CurrentAccount:', currentAccount)
            fetchNFTMetadata()
        }
        setIsLoading(false)
    }, [currentAccount])

    const connectWalletAction = async () => {
        try {
            const { ethereum } = window

            if (!ethereum) {
                alert('Get MetaMask!')
                return
            }

            /*
             * Fancy method to request access to account.
             */
            const accounts = await ethereum.request({
                method: 'eth_requestAccounts',
            })

            /*
             * Boom! This should print out public address once we authorize Metamask.
             */
            console.log('Connected', accounts[0])
            setCurrentAccount(accounts[0])
        } catch (error) {
            console.log(error)
        }
    }

    if (isLoading) {
        return <LoadingIndicator />
    }

    return (
        <div className="App">
            <div className="container">
                <p>Use Kovan Test Network to play</p>
                <div className="header-container">
                    <p className="header gradient-text">⚔️ Monster Slayer ⚔️</p>
                    <p className="sub-text"></p>
                    <div className="connect-wallet-container">
                        <img
                            src="https://data.whicdn.com/images/273929193/original.gif"
                            alt="Stranger Things Gif"
                        />
                    </div>
                    {!currentAccount && (
                        <button
                            className="cta-button connect-wallet-button"
                            onClick={connectWalletAction}
                        >
                            Connect Wallet To Get Started
                        </button>
                    )}
                    {currentAccount && !characterNFT && (
                        <SelectCharacter setCharacterNFT={setCharacterNFT} />
                    )}
                    {currentAccount && characterNFT && (
                        <Arena characterNFT={characterNFT} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default App
