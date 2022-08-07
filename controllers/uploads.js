const path = require('path');
const fs = require('fs');

const { request, response } = require("express");


const {Usuario} = require('../models');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);


const cargarArchivos = async (req= request, res = response) => {
    
    try {
        const {tempFilePath} = req.files.archivo;
        const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
        
        res.json({
            secure_url
        });
    } catch (error) {
        res.status(400).json({
            msg: `${error}`
        });
    }
    
}

const mostrarImagen = async (req, res = response) =>{

    const { id, coleccion} = req.params;  
    
    let modelo;

    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con ese id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con ese id ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Se me olvido validar esto'
            });

    }


    //limpiar imagenes previas
    if(modelo.img){
        //hayq ue borrar la imagen del servidor
        const pathImage = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if(fs.existsSync(pathImage)){
            return res.sendFile(pathImage);
        }
    }

    //si no encuentra la imagen del usuario o producto
    //manda un imagen por defecto (placeholder)
    const pathNoImage = path.join(__dirname, '../assets/no-image.jpg')
    return res.sendFile(pathNoImage);

}

const actualizarImagenCloudinary = async (req = request, res = response) => {
    
    const {id} = req.params;  
    
    let modelo;

    modelo = await Usuario.findById(id);


    //limpiar imagenes previas
    if(modelo.img){
        //conseguimos el nombre del archivo
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1]
        const [public_id]  = nombre.split('.')

        //lo borramos
        cloudinary.uploader.destroy(public_id);
    }
    
    const {tempFilePath} = req.files.archivo;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url

    await modelo.save();
    
    res.json({
        modelo
    });
}

const eliminarImagenCloudinary = async (req = request, res =response) => {
    const {imagen} = req.body;

    //conseguimos el nombre del archivo
    const nombreArr = imagen.split('/');
    const nombre = nombreArr[nombreArr.length - 1]
    const [public_id]  = nombre.split('.')

    //lo borramos
    cloudinary.uploader.destroy(public_id);
    
    res.json({
        msg : 'ok'
    });
}


module.exports = {
    cargarArchivos,
    mostrarImagen,
    actualizarImagenCloudinary,
    eliminarImagenCloudinary
}