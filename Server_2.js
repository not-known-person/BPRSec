import bls from "@chainsafe/bls/blst-native";
import blake3 from 'blake3';
// import { ethers } from "ethers";
import express from "express";
import net from 'net';

let app = express();

// const abi = require(".artifacts/contracts/BPRSec.sol/BPRSec.sol");

// const provider = new ethers.JsonRpcProvider("http://localhost:8545")

// const signer = new ethers.Wallet("private_key", provider);

// const contract = new ethers.Contract("0x5FbDB2315678afecb367f032d93F642f64180aa3", abi, signer);

const secretKey = bls.SecretKey.fromKeygen();

const publicKey = secretKey.toPublicKey();

const blocks = {}

const currentAddress = "192.168.45.67"


const server = net.createServer((socket) => {
    socket.on('data', (data) => {
        console.log(new Uint8Array([...Object.values(data.hash)]))
    });

    socket.on('error', (err) => {
        console.error('Socket error:', err);
    });
});


const client = net.createConnection({ port: 8080 }, () => {
    console.log('Connected to server');
    try {
        client.write(onMessageSend({
            "header": {
                "source_address": "192.168.1.103",
                "destination_address": "10.0.0.1",
                "packet_length": 60
            },
            "payload": {
                "temperature": 20.3,
                "timestamp": "2024-03-17T08:15:00",
                "sensor_id": "sensor004"
            },
            "checksum_crc": "0x819D",
            "protocol_specific": {
                "protocol": "MQTT",
                "topic": "/temperature/sensor004"
            }
        }));
    } catch (error) {
        console.log("err", error)
        console.log("Package dropped")
    }
});

// client.on('data', (data) => {
//     console.log('Received message from server:', data.toString());
// });

// client.on('error', (err) => {
//     console.error('Client error:', err);
// });

server.listen(8081, () => {
    console.log('Server listening on port 8080');
});

const onMessageSend = (msg) => {
    const signedMsg = signMsg(msg);
    if (signedMsg) {
        return JSON.stringify(signedMsg)
    }
    return
}

const onMessageRecieve = (msg) => {
    if (msg.ttl <= 0) {
        return;
    }
    const isVerified = verifyMsg(msg)
    if (isVerified) {
        msg.ttl--;
    }
    else {
        // drop packet
    }

}
const signMsg = (msg) => {
    const hash = new TextEncoder().encode(JSON.stringify(msg?.payload));
    const signature = bls.sign(secretKey.toBytes(), hash);
    msg.hash = hash;
    msg.signature = signature;
    msg.publicKey = bls.secretKeyToPublicKey(secretKey.toBytes());
    console.log(msg)
    return msg;
}

const verifyMsg = async (msg) => {
    if (bls.verify(msg.signature, msg.publicKey, msg.message)) {
        if (blocks[msg.destination].thresh) {
            blocks[msg.destination].thresh = (blocks[msg.destination].temp_blocks.reduce((acc, block) => { BigInt("0x" + acc.hash), BigInt("0x" + block.hash), 0 })) / blocks[msg.destination].temp_blocks.length
        }
        else {
            blocks[msg.destination].thresh = BigInt("0x" + msg.hash);
            blocks[msg.destination].sum = BigInt("0x" + msg.hash);
            blocks[msg.destination].total = 1;
        }
        if ((BigInt("0x" + msg.hash) <= blocks[msg.destination].thresh) && blocks[msg.destination].count < 10) {
            msg.root = true;
            blocks[msg.destination].count++;
            blocks[msg.destination].hopArray.push({ currentAddress: 1 });
            blocks[msg.destination].temp_blocks.push(msg);
        }
        else {
            msg.root = false
        }
        if (blocks[msg.destination].count == 10) {
            const block = {};
            block.data = blocks[msg.destination].temp_blocks
            block.timeStamp = new Date().getTime()
            block.signature = blake3.hash(blocks[msg.destination].data.map(block => block.hash).join(""))
            block.hopArray = blocks[msg.destination].hopArray;
            block.dest = msg.destination
            block.src = msg.src
            // await contract.save(block)
            blocks[msg.destination].count = 0
        }
        if (msg.destination == currentAddress) {
            await contract.distributeTokens((blocks[msg.destination].hopArray.map(hop => hop[hop.keys()[0]] == 1)));
            blocks[msg.destination].hopArray.forEach((hop) => {
                hop[hop.keys()[0]] = 2
            });
        }
        return msg
    }
    else {
        return 0;
    }
}


app.get('/', function (req, res) {
    contract.getAllToken().then((data) =>
        res.send(data)
    )
}); 
