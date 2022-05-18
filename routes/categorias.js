const {Router} = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoria, esRoleValido } = require('../helpers/db-validators');
const {validarJWT, validarCampos, tieneRole} = require('../middlewares/');

const router = Router();


//obtener todas las categorias- publico
router.get('/', obtenerCategorias);

//obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoria), // usar db-validator
    validarCampos
], obtenerCategoria);

//crear categoria - privado - cualquier persona con token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

//actualizar el registro por id - privado
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
] ,actualizarCategoria);

//borrar categoria por id- privado- solo administrador
router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN' , 'MOD'),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
],borrarCategoria);






module.exports = router;