const mongoose = require('mongoose')
const {Schema} = mongoose;
const path = require('path')

//los nombres como title, etc los pongo yo
const ImageSchema = new Schema({
    title:{type:String},
    description: {type: String},
    filename: {type: String},
    views: {type:Number, default:0},
    likes: {type:Number, default:0},
    timestamp:{type:Date,default:Date.now}
});

//le voy a quirar la extension al nombre con una variable virtual, y no se almacena en la base de datos
ImageSchema.virtual(`uniqueId`)
    .get(function(){
        return this.filename.replace(path.extname(this.filename), '')
    })

module.exports = mongoose.model('Image', ImageSchema);