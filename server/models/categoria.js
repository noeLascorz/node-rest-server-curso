const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator');

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'Se requiere una descripcion']
    },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
})


module.exports = mongoose.model('Categoria', categoriaSchema)