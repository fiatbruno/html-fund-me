import { ethers } from "./ethers-5.1.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectBtn = document.getElementById("connectBtn")
const fundBtn = document.getElementById("fundBtn")

connectBtn.onclick = connect
fundBtn.onclick = fund

async function connect() {
    if (typeof window.ethereum != undefined) {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
            connectBtn.innerHTML = "Connected"
        } catch (error) {
            console.log(error)
        }
    } else {
        connectBtn.innerHTML = "Plz install Metamask"
    }
}

async function fund() {
    const ethAmount = "0.1"
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum != undefined) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!🤝")
        } catch (error) {
            console.log(error)
        }
    } else {
        fundBtn.innerHTML = "Plz install Metamask"
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
        })
        resolve()
    })
}
