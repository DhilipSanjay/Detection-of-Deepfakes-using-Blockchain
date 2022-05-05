const express = require('express');

const recordRoutes = express.Router();

const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;


recordRoutes.route("/ipfsRecord").get((req, res) =>{
    let dbConnect = dbo.getDb("blockchain_data");
    dbConnect
      .collection("transaction_ipfs")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});

recordRoutes.route("/ipfsRecord/:ipfsHash").get((req, res) =>{
    let dbConnect = dbo.getDb("blockchain_data");
    let query = { ipfsHash: req.params.ipfsHash};
    dbConnect
      .collection("transaction_ipfs")
      .findOne(query, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});

recordRoutes.route("/ipfsRecord/insert").post((req, response) =>{
    let dbConnect = dbo.getDb("blockchain_data");
    let document = {
        ipfsHash: req.body.ipfsHash,
        transactionHash: req.body.transactionHash
    };
    dbConnect
      .collection("transaction_ipfs")
      .insertOne(document, function (err, res) {
        if (err) throw err;
        response.json(res);
      });
});

module.exports = recordRoutes;