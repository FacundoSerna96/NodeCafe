const {Router} = require('express');
const { check } = require('express-validator');
const { cargarArchivos, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers/db-validators');
const { validarArchivoSubir } = require('../middlewares');
const { validarCampos } = require('../middlewares/validarCampos');


const router = Router();


router.get('/:coleccion/:id',[
    check('id','El id debe de ser de mongodb ').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c , ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen);

router.post('/', [
    validarArchivoSubir
],cargarArchivos);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id','El id debe de ser de mongodb ').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c , ['usuarios', 'productos'])),
    validarCampos
], actualizarImagenCloudinary);


module.exports = router;