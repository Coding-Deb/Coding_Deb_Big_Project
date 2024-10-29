import mongoose , {Schema} from "mongoose";

const enrollSchema = new Schema({
    enrollmentId:{
        type: String,
        required: true
    },
    userId:{
        type: "String",
        ref: "User"
    },
    courseId:{
        type: "String",
        ref: "Course"
    },
    enrollmentDate:{
        type: Date,
        default: Date.now()
    }
})

enrollSchema.methods.enroll = async function (courseId){
    
}

const Enroll = mongoose.model("Enroll",enrollSchema);

export default Enroll;