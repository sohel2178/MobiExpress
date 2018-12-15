const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const Transaction = require('../model/transaction')

router.get('/',(req,res,next)=>{
    Transaction.find()
        .populate('from','name')
        .populate('to','name')
        .exec()
        .then(docs=>{
            return res.status(200).json({
                count:docs.length,
                transaction:docs
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
    transaction = new Transaction({
        _id:mongoose.Types.ObjectId(),
        purpose:req.body.purpose,
        customer_id:req.body.customer_id,
        device_id:req.body.device_id,
        invoice_no:req.body.invoice_no,
        date:req.body.date,
        from:req.body.from,
        to:req.body.to,
        amount:req.body.amount
    });

    if(transaction.from===transaction.to){
        return res.status(500).json({
            message:"Transaction is not Allowed between Same Account"
        })
    }

    transaction.save()
        .then(doc=>{
            doc.populate('from','name')
                .populate('to','name')
                .execPopulate()
                .then(result=>{
                    return res.status(201).json({
                        message:"Transaction Added Successfully",
                        transaction:result
                    })
                })

            
        })
        .catch(err=>{
            return res.status(500).json({
                message:err.name,
                error:err
            })
        })
});


router.post('/get_customer_transaction/',(req,res,next)=>{
    const customer_id = req.body.customer_id;

    Transaction.find({customer_id:customer_id})
        .select('purpose device_id invoice_no date amount to from')
        .populate('from','name')
        .populate('to','name')
        .exec()
        .then(docs=>{
            return res.status(201).json({
                count:docs.length,
                transactions:docs
            })
        })
        .catch(err=>{
            return res.status(500).json({
                message:err.name,
                error:err
            })
        })
})

router.post('/get_transactions_by_account/',(req,res,next)=>{
    const accountId = req.body.account_id;
    Transaction.find({$or:[{to:accountId},{from:accountId}]})
        .exec()
        .then(docs=>{
            res.status(201).json({
                count:docs.length,
                transactions:docs
            })
        })
        .catch(err=>{
            res.status(500).json({
                message:err.name,
                error:err
            })
        })
})


router.post('/get_transactions_by_device_id/',(req,res,next)=>{
    const deviceId = req.body.device_id;
    Transaction.find({device_id:deviceId})
        .exec()
        .then(docs=>{
            res.status(201).json({
                count:docs.length,
                transactions:docs
            })
        })
        .catch(err=>{
            res.status(500).json({
                message:err.name,
                error:err
            })
        })
})


module.exports = router;