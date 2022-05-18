const {Schema, model} = require('mongoose');

const UsuarioSchema = Schema({
    uid :{
        type: String,
        unique : [true]
    },
    nombre : {
        type: String,
        required : [true, 'El nombre es Obligatorio']
    },
    correo: {
        type : String,
        required: [true, 'El correo es Obligatorio'],
        unique: true
    },
    password: {
        type : String,
        required: [true, 'La contraseña es Obligatorio'],
    },
    img: {
        type : String,
    },
    rol: {
        type : String,
        required: true,
        emun: ['ADMIN', 'ANON']
    },
    estado: {
        type : Boolean,
        default: true,
    },
    google: {
        type : Boolean,
        default: false
    }

});

UsuarioSchema.methods.toJSON = function() {
    const {__v, password, _id, ...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario;
}


module.exports = model('Usuario', UsuarioSchema);