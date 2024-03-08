import ethers from "ethers";
import bls from "@chainsafe/bls/blst-native";
import blake3 from 'blake3';


// const provider = new ethers.JsonRpcProvider("https://goerli.infura.io/v3/7b44fc1db7cb457cba9a7b5dd6a0e497")

// const signer = new ethers.Wallet("ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" , provider);

// const abi =  require("./contracts/Lock.sol");

// const contractInstance = new ethers.Contract("1x677b4b5b6",abi,signer);



const thresh = BigInt("0x" + "f694a1eca435cc9a0af444f69830b5d480f8c9b01e2ce62bb720422fb0a5193e");

const count = 0;

const secretKey = bls.SecretKey.fromKeygen();

const publicKey = secretKey.toPublicKey();

const hopArray = [];

const temp_block = [];

const currentAddress = "192.168.45.67"

const interceptMsg = (msg) => {
    //intercepting  outgoing IOT data packets
    const signedMsg = signMsg(msg);
    if (signedMsg) {
        // forwarding IOT packets to destination
    }
}

const receieveMsg = (msg) => {
    // intercepting incoming IOT data packets
    const isVerified = verifyMsg(msg)
    if (isVerified) {
        // let the packets come in 
    }
}

const signMsg = (msg) => {
    const hash = blake3.hash(JSON.stringify(msg)).toString("hex");
    const signature = secretKey.sign(hash);
    msg.hash = hash;
    msg.sign = signature;
    msg.publicKey = publicKey;
    return verifyMsg(msg)
}

const verifyMsg = (msg) => {
    if (bls.verify(msg.signature, msg.publicKey, msg.message)(msg)) {
        if (BigInt("0x" + packet.hash) > thresh && count < 10) {
            msg.root = true;
            ++count;
            hopArray.push(source);
            temp_block.push(msg);
        }
        else {
            msg.root = false
        }
        if (count == 10) {
            const block = {};
            block.data = temp_block;
            block.timeStamp = new Date().getTime();
            block.hash = blake3.hash(block.data);
        }
        if (msg.destination == currentAddress) {
            // Calling smart contract 
            return msg
        }
        else {
            return msg
        }
    }
    else {
        return 0;
    }

}
