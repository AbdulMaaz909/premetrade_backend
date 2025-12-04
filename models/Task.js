import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true
    },
    description: {
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,ref:"User"
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})


export default mongoose.model("Task",taskSchema);