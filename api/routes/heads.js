const express = require('express');
const Head = require('../model/head')
const mongoose = require('mongoose');
const router = express.Router();

router.get('/',(req,res,next)=>{
    Head.find().select('name customer_id')
        .exec()
        .then(docs=>{
            return res.status(200).json({
                count:docs.length,
                heads:docs
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
    head = new Head({
        _id:mongoose.Types.ObjectId(),
        name:req.body.name,
        customer_id:req.body.customer_id
    });

    head.save()
        .then(doc=>{
            return res.status(201).json({
                message:"Head Created SuccessFully",
                head:doc
            })
        })
        .catch(err=>{

            if(err.name==='MongoError'){
                return res.status(401).json({
                    message:"Head Already Exist"
                })
            }

            return res.status(500).json({
                message:"Unknown Error",
                error:err
            })
           
        });
});




router.post('/get_customer_heads/',(req,res,next)=>{
    const coustomerId = req.body.customer_id;

    Head.find({customer_id:coustomerId})
        .select('name')
        .exec()
        .then(docs=>{
            return res.status(200).json({
                count:docs.length,
                heads:docs
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
    Head.findById(id)
      .select('name')
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
          return res.status(200).json({
              head: doc
          });
        } else {
            return res
            .status(404)
            .json({ message: "No valid entry found for provided ID" });
        }
      })
      .catch(err => {
        console.log(err);
        return res.status(500).json({ error: err });
      });
  });


  router.put("/:id", (req, res, next) => {
    const id = req.params.id;

    Head.findById(id)
        .exec()
        .then(head=>{
            head.name= req.body.name
            head.save()
                .then(doc=>{
                    return res.status(201).json({message:"Head Updated"})
                })
                .catch(err=>{
                    return res.status(500).json({error:err})
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
          });
  });
  


module.exports = router;