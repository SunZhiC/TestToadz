
import { ethers, run } from "hardhat"
import { TestToadz__factory } from "../typechain-types";
import { chains, EthereumSepolia } from "@particle-network/chains";

export async function deploy() {
    const provider = ethers.provider;
    const chainId = (await provider.getNetwork()).chainId;

    provider
    const privateKey = process.env.PRIVATE_KEY as string;
    if (privateKey === '') {
        throw new Error('You should set PRIVATE_KEY in .env file');
    }

    const contractABI = TestToadz__factory.abi;
    const contractBytecode = TestToadz__factory.bytecode;

    const wallet = new ethers.Wallet(privateKey, provider);

    // tetsnet funding wallet
    if (chainId == 31337n) {
        const [sender] = await ethers.getSigners();
        const receiver = wallet.address;
        const amount = ethers.parseEther("100");
        const tx = await sender.sendTransaction({
            to: receiver,
            value: amount,
        });
        await tx.wait();
    }

    const ContractFactory = new ethers.ContractFactory(contractABI, contractBytecode, wallet) as TestToadz__factory


    const chainInfo = chains.getEVMChainInfoById(Number(chainId));
    const isSupportsEIP1559 = chains.isChainSupportEIP1559(chainInfo ?? EthereumSepolia);

    const txParams = {
        ...(isSupportsEIP1559 ? {
            type: 2
        } : {
            type: 0
        })
    };

    const contract = await ContractFactory.deploy(txParams);
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    console.log(`deploy contract address ${contractAddress}`)


    if (chainId !== 31337n) {
        console.log(`start verify contract`)
        await run("verify:verify", {
            address: contractAddress
        });
        console.log(`finsh verify contract`)
    }
}

deploy().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
