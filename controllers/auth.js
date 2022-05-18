const bcryptjs = require("bcryptjs");
const { response, request } = require("express");
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");
const Usuario = require('../models/usuario');


const login = async (req, res = response) => {

    const {correo, password} = req.body;

    try {
        //verificar si el mail existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - correo'
            })
        }

        //verificar si el usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - estado: false'
            })
        }

        //verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - password'
            })
        }

        //generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Algo salio mal'
        })
    }
}


const googleSignIn = async (req = request, res =response) =>{
    const {id_token} = req.body;

    try {
        const {correo, nombre, img} = await googleVerify(id_token);
        
        let usuario = await Usuario.findOne({correo});
        
        if(!usuario){
            ///tengo que crearlo
            const data = {
                nombre,
                correo,
                password : 'hola',
                rol: 'ANON',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        //si el usuario en BD
        if (!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        // generar el jwt 
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        res.status(400).json({
            msg :`${error}`
        })
    }

    
}

module.exports= {
    login,
    googleSignIn
}