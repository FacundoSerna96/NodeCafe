const { response, request} = require("express");
const {ObjectId} = require('mongoose').Types;
const {Usuario, Categoria, Producto} = require('../models');

const coleccionesPermitidas = [
    'usuarios',
];

const buscarUsuarios = async(termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino);

    if(esMongoId){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results : (usuario) ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or : [{nombre : regex},{correo : regex}],
        $and : [{estado : true}]
    });
    return res.json({
        results : usuarios
    });
}


const buscar = (req = request, res = response) =>{

    const {coleccion, termino} = req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch(coleccion){
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;

        default:
            res.status(500).json({
                msg: 'No existe esta busqueda'
            });
    }
    
}


module.exports = {
    buscar
};