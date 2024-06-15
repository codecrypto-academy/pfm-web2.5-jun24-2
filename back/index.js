//const { Web3 } = require('web3');
const express = require("express");
const fs = require("fs")

//const web3 = new Web3("http://localhost:8545") // nodo de red
const cors = require('cors');
const { ok } = require('assert');

const app = express();
app.use(cors());
app.listen(3333);

app.get("/", async (req, res) => {
    res.send("OK")}
);

app.post("/faucet/:address", async (req, res) => {
    try {        
        res.send(ok);
    } catch (error) {        
        res.status(500).send( error);
    }
});


app.get("/balance/:address", async(req, res)=>{ 
    try {        
        res.send(ok);
    } catch (error) {        
        res.status(500).send( error);
    }
})

async function getEthereumBalance(ethAddress) {
    try {        
        res.send(ok);
    } catch (error) {        
        res.status(500).send( error);
    }
}