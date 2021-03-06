const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La categoria es necesaria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
})

// Para validar datos únicos
categoriaSchema.plugin(uniqueValidator, { message: 'La {PATH} debe ser única' })

// Para exportar/exponer el modelo creado
module.exports = mongoose.model('Categoria', categoriaSchema);