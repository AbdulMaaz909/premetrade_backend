import express from 'express'
import Task from '../models/Task.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router();

// CREATE TASK
router.post('/',authMiddleware,async(req,res)=>{
    try {
        const {title,description}=req.body;

        const task = await Task.create({
            title,
            description,
            user:  req.user.id
        });
        res.json(task)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

//GET ALL TASK  
router.get('/',authMiddleware, async (req,res) => { 
    try {
       const task = await Task.find({user:req.user.id}) 
       res.json({ tasks: task });
    } catch (error) {
        res.status(500).json({messgae:error.message})
    }
});

router.put('/:id',authMiddleware,async (req,res) => {
    try {
        const task = await Task.findOneAndUpdate({
            _id:req.params.id,user:req.user.id
        },
    req.body,
    {new:true}   
    )
    res.json(task);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

router.delete('/:id',authMiddleware, async (req,res) =>{
    try {
        await Task.findOneAndDelete({ _id:req.params.id, user:req.user.id});

        res.json({message:"Task Deleted "})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})





export default router;