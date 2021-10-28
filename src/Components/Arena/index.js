import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { transformCharacterData } from '../../utils'
import myEpicGame from '../../artifacts/contracts/NFTGame.sol/MyEpicGame.json'
import LoadingIndicator from '../LoadingIndicator'
import './Arena.css'

/*
 * We pass in our characterNFT metadata so we can a cool card in our UI
 */
const Arena = ({ characterNFT }) => {
    const [gameContract, setGameContract] = useState(null)
    const [boss, setBoss] = useState(null)
    const [attackState, setAttackState] = useState('')
    const [characterNFTMeta, setCharacterNFTMeta] = useState(characterNFT)
    const [showToast, setShowToast] = useState(false)

    useEffect(() => {
        const { ethereum } = window

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const gameContract = new ethers.Contract(
                process.env.REACT_APP_CONTRACT,
                myEpicGame.abi,
                signer,
            )

            setGameContract(gameContract)
        } else {
            console.log('Ethereum object not found')
        }
    }, [])

    useEffect(() => {
        const fetchBoss = async () => {
            const bossTxn = await gameContract.getBigBoss()
            console.log('Boss:', bossTxn)
            setBoss(transformCharacterData(bossTxn))
        }

        /*
         * Setup logic when this event is fired off
         */
        const onAttackComplete = (newBossHp, newPlayerHp) => {
            const bossHp = newBossHp.toNumber()
            const playerHp = newPlayerHp.toNumber()

            console.log(
                `AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`,
            )

            /*
             * Update both player and boss Hp
             */
            setBoss(prevState => {
                return { ...prevState, hp: bossHp }
            })

            setCharacterNFTMeta(prevState => {
                return { ...prevState, hp: playerHp }
            })
        }

        if (gameContract) {
            fetchBoss()
            gameContract.on('AttackComplete', onAttackComplete)
        }

        /*
         * Make sure to clean up this event when this component is removed
         */
        return () => {
            if (gameContract) {
                gameContract.off('AttackComplete', onAttackComplete)
            }
        }
    }, [gameContract])

    const runAttackAction = async () => {
        try {
            if (gameContract) {
                setAttackState('attacking')
                console.log('Attacking boss...')
                const attackTxn = await gameContract.attackBoss()
                await attackTxn.wait()
                console.log('attackTxn:', attackTxn)
                setAttackState('hit')
                setShowToast(true)
                setTimeout(() => {
                    setShowToast(false)
                }, 5000)
            }
        } catch (error) {
            console.error('Error attacking boss:', error)
            setAttackState('')
        }
    }
    return (
        <div className="arena-container">
            {boss && showToast && (
                <div id="toast" className="show">
                    <div id="desc">{`💥 ${boss.name} was hit for ${characterNFT.attackDamage}!`}</div>
                </div>
            )}
            {boss && (
                <div className="boss-container">
                    <div className={`boss-content`}>
                        <h2>🔥 {boss.name} 🔥</h2>
                        <div className="image-content">
                            <img
                                src={boss.imageURI}
                                alt={`Boss ${boss.name}`}
                            />
                            <div className="health-bar">
                                <progress value={boss.hp} max={boss.maxHp} />
                                <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
                            </div>
                        </div>
                    </div>
                    <div className="attack-container">
                        <button
                            className="cta-button"
                            onClick={runAttackAction}
                        >
                            {`💥 Attack ${boss.name}`}
                        </button>
                    </div>
                </div>
            )}
            {attackState === 'attacking' && (
                <div className="loading-indicator">
                    <LoadingIndicator />
                    <p>Attacking ⚔️</p>
                </div>
            )}
            {characterNFTMeta && (
                <div className="players-container">
                    <div className="player-container">
                        <h2>Your Character</h2>
                        <div className="player">
                            <div className="image-content">
                                <h2>{characterNFTMeta.name}</h2>
                                <img
                                    src={characterNFTMeta.imageURI}
                                    alt={`Character ${characterNFTMeta.name}`}
                                />
                                <div className="health-bar">
                                    <progress
                                        value={characterNFTMeta.hp}
                                        max={characterNFTMeta.maxHp}
                                    />
                                    <p>{`${characterNFTMeta.hp} / ${characterNFTMeta.maxHp} HP`}</p>
                                </div>
                            </div>
                            <div className="stats">
                                <h4>{`⚔️ Attack Damage: ${characterNFTMeta.attackDamage}`}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Arena
