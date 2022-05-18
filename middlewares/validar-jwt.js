const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


const validarJWT = async (req = request, res = response, next) =>{
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la peticion.'
        });
    }

    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuarioAutenticado = await Usuario.findById(uid);

        req.usuarioAutenticado = usuarioAutenticado;
        req.uid = uid;

        if(!usuarioAutenticado){
            return res.status(401).json({
                msg:'Token no valido - usuario no existe'
            }); 
        }

        //validar que el usuario no ha sido borrado
        if(!usuarioAutenticado.estado){
            return res.status(401).json({
                msg:'Token no valido - usuario con estado eliminado'
            });
        }
        
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }
}


module.exports = {
    validarJWT
}