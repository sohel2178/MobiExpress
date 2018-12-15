const express = require('express');
const Account = require('../model/account');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/',(req,res,next)=>{
    Account.find().select('name customer_id type')
        .exec()
        .then(docs=>{
            return res.status(200).json({
                count:docs.length,
                accounts:docs
            })
        })
        .catch(err=>{
            return res.status(500).json({
                message:err.name,
                error:err
            })
        })
});

router.post('/',(req,res,next)=>{
    account = new Account({
        _id:mongoose.Types.ObjectId(),
        name:req.body.name,
        customer_id:req.body.customer_id,
        type:req.body.type
    });

    account.save()
        .then(doc=>{
            return res.status(201).json({
                message:"Account Added SuccessFully",
                account:doc
            })
        })
        .catch(err=>{

            if(err.name==='MongoError'){
                return res.status(401).json({
                    message:"Account Already Exist"
                })
            }

            return res.status(500).json({
                message:"Unknown Error",
                error:err
            })
           
        });
});



router.post('/get_customer_accounts/',(req,res,next)=>{
    const coustomerId = req.body.customer_id;

    Account.find({customer_id:coustomerId})
        .select('name type')
        .exec()
        .then(docs=>{
            return res.status(200).json({
                count:docs.length,
                accounts:docs
            })
        })
        .catch(err=>{
            

            return res.status(500).json({
                message:err.name,
                error:err
            })
        })
        
})


module.exports = router;