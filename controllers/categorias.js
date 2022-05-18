const { request, response } = require("express");
const res = require("express/lib/response");
const {Categoria} = require('../models');


const obtenerCategorias = async (req = request , res = response) => {
    const {limite = 5, desde = 0} = req.query;
    const query = {estado : true};

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        categorias
    })
}

const obtenerCategoria = async (req = request , res = response) => {
    const {id} = req.params;

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.json({
        categoria
    })
}

const crearCategoria = async (req, res = response) => {

    const nombre  = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    //generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuarioAutenticado._id
    }

    const categoria = await new Categoria(data);

    //guardar en DB
    await categoria.save();
     
    res.status(201).json(categoria);
}


//actualizar categoria (recive nombre)
const actualizarCategoria = async (req =request, res = response) => {
    const {id} = req.params; 
    const {estado, usuario, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new:true});
    const categoriaModificada = await Categoria.findById(id);

    res.json({
        categoriaModificada
    })
}

//borrar categoria - cambiar el estado a false
const borrarCategoria = async (req = request , res= response) => {
    const {id} = req.params;

    //cambiar el estado de la categoria
    const categoria = await Categoria.findByIdAndUpdate(id, {estado:false});
    const categoriaBorrada = await Categoria.findById(id);

    res.json({
        categoriaBorrada
    })
}

module.exports= {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}