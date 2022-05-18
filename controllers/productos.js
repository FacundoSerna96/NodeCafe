const { request, response } = require("express");
const { Producto } = require("../models");


const productoGet = async (req = request, res = response) => {
    const {limite = 5, desde = 0} = req.query;
    const query = {estado : true};

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    })
}


const productoGetOne = async (req = request, res = response) => {
    const {id} = req.params;

    const producto = await Producto.findById(id).
                                    populate('usuario', 'nombre').
                                    populate('categoria', 'nombre')
                                    
    res.json({
        producto
    })
}


const productoPost = async (req = request, res = response) => {
    const {estado, usuario, ... resto} = req.body;


    const productoDB = await Producto.findOne({nombre : resto.nombre});

    if(productoDB){
        return res.status(400).json({
            msg: `El producto ${categoriaDB.nombre}, ya existe`
        })
    }

    //generar la data a guardar
    const data = {
        nombre : resto.nombre,
        usuario: req.usuarioAutenticado._id
    }

    const producto = await new Producto(data);

    //guardar en base de datos
    await producto.save();

    res.status(201).json({
        producto
    })
}


const productoPut = async (req = request, res = response) => {
    const {id} = req.params; 
    const {usuario,estado, _id, ...data} = req.body;

    data.usuario = req.usuarioAutenticado._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {new:true});
    const productoModificado = await Producto.findById(id);

    res.json({
        productoModificado
    })
}


const productoDelete = async (req = request, res = response) => {
    const {id} = req.params;

    //cambiar el estado de la categoria
    const producto = await Producto.findByIdAndUpdate(id, {estado:false});
    const produtoBorrado = await Producto.findById(id);

    res.json({
        produtoBorrado
    })
}


module.exports = {
    productoGet,
    productoGetOne,
    productoPost,
    productoPut,
    productoDelete
}