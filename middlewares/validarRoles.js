const { response, request } = require("express");


const esAdminRole = (req = request, res = response, next) =>{
    
    if(!req.usuarioAutenticado){
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        })
    }

    const {rol, nombre} = req.usuarioAutenticado;

    if(rol !== 'ADMIN'){
        return res.status(401).json({
            msg:`${nombre} no es administrador- No puede hacer eso`
        })
    }


    next();
}

const tieneRole = (...roles) =>{
    
    return (req = request, res = response, next) =>{
        if(!req.usuarioAutenticado){
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            })
        }
    
        if(!roles.includes(req.usuarioAutenticado.rol)){
            return res.status(401).json({
                msg:`El servicio requiere uno de estos roles ${roles}`
            });
        }

        next();
    }
}


module.exports = {
    esAdminRole,
    tieneRole
}