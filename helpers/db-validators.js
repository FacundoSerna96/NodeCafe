const { Categoria, Producto } = require('../models');
const Role = require('../models/role');
const Usuario = require('../models/usuario');


const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({rol})
    if(!existeRol){
        throw new Error(`El rol ${rol} no  esta registrado en la BD`);
    }
}

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

const existeCategoria = async(id) => {
    const existeCategoria = await Categoria.findById(id)
     if(!existeCategoria){
        throw new Error(`La categoria con id ${id} no existe. `);
     }
}


const existeProducto = async(id) => {
    const existeProducto = await Producto.findById(id)
     if(!existeProducto){
        throw new Error(`El producto con id ${id} no existe. `);
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
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto,
    coleccionesPermitidas
}