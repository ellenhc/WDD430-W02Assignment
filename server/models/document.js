const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String },
    url: { type: String },
    //children is an array of child docs that are related
    children: [{type: Document}]
 });
 
 module.exports = mongoose.model('Document', documentSchema);