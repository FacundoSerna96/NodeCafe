const {response, request} = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');


const usuariosGet = async (req =request, res = response) => {

    const {limite = 5, desde = 0} = req.query;
    const query = {estado : true};

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    })
}

const usuarioGetOne = async (req = request, res = response) =>{
    const {id} = req.params;

    const usuario = await Usuario.findById(id);

    res.json({
        usuario
    })
}

const usuariosPost = async (req, res = response) => {
    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol})

    //encriptar la contraseña
    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync(password, salt);

    //guardar en base de datos
    await usuario.save();

    res.json({
        usuario
    })
}

const usuariosPut = async (req, res = response) => {
    const {id} = req.params; 
    const {_id, password, google, correo, ...resto} = req.body;

    
    //todo validar contra base de datos
    if(password) {
        //encriptar la contraseña
        const salt = bcryptjs.genSaltSync(10);
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        usuario
    })
}

const usuariosDelete = async(req = request, res = response) => {

    const {id} = req.params;

    const uid = req.uid;

    //borra fisicamente
    //const usuario = await Usuario.findByIdAndDelete(id);

    //cambiar el estado del usuario
    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});
    
    res.json({
        usuario
    })
}



module.exports = {
    usuariosGet,
    usuarioGetOne,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}