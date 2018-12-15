const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const Tran = require('../model/tran')


router.get('/',(req,res,next)=>{
    Tran.find()
        .populate('head','name')
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

router.post("/",(req,res,next)=>{
    transaction = new Tran({
        _id:mongoose.Types.ObjectId(),
        purpose:req.body.purpose,
        customer_id:req.body.customer_id,
        device_id:req.body.device_id,
        invoice_no:req.body.invoice_no,
        date:req.body.date,
        head:req.body.head,
        amount:req.body.amount
    });

    transaction.save()
    .then(doc=>{
        doc.populate('head','name')
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

    Tran.find({customer_id:customer_id})
        .select('purpose device_id date amount head')
        .populate('head','name')
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


router.get("/:id", (req, res, next) => {
    const id = req.params.id;
    Tran.findById(id)
      .populate('head','name')
      .exec()
      .then(doc => {
        if (doc) {
          return res.status(200).json({
              transaction: doc
          });
        } else {
            return res
            .status(404)
            .json({ message: "No valid entry found for provided ID" });
        }
      })
      .catch(err => {
        //console.log(err);
        return res.status(500).json({ error: err });
      });
  });


  router.put("/:id", (req, res, next) => {
    const id = req.params.id;

    Tran.findById(id)
        .exec()
        .then(tran=>{
            tran.date= req.body.date
            tran.purpose= req.body.purpose
            tran.device_id= req.body.device_id
            tran.head= req.body.head
            tran.amount= req.body.amount

            tran.save()
                .then(doc=>{
                    return res.status(201).json({message:"Transaction Updated"})
                })
                .catch(err=>{
                    console.log(err);
                    return res.status(500).json({error:err})
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
          });
  });


  router.delete("/:id", (req, res, next) => {
    const id = req.params.id;
    Tran.remove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json({
            message: 'Transaction Deleted'
        });
      })
      .catch(err => {
        //console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });
  


  module.exports = router;


