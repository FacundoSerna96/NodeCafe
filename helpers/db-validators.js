const Usuario = require('../models/usuario');

const emailExiste = async (correo = '') =>{
     //verificar si el correo existe
     const existeEmail = await Usuario.findOne({correo})
     if(existeEmail){
        throw new Error(`El email ${correo} ya esta registrado en la BD`);
     }
}

const existeUsuarioPorId = async (id) =>{
    const existeUsuario = await Usuario.findById(id)
     if(!existeUsuario){
        throw new Error(`El Usuario con id ${id} no existe. `);
     }
}


//validar las colecciones permitidas
const coleccionesPermitidas = (coleccion = '', colecciones = []) =>{
    const incluida = colecciones.includes(coleccion);
    if(!incluida){
        throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`)
    }

    return true;
}


module.exports = {
    emailExiste,
    existeUsuarioPorId,
    coleccionesPermitidas
}