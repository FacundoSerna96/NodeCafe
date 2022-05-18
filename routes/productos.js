const { Router } = require("express");
const { check } = require("express-validator");
const { productoGet, productoGetOne, productoPost, productoPut, productoDelete } = require("../controllers/productos");
const { existeProducto, existeCategoria, existeUsuarioPorId } = require("../helpers/db-validators");
const { validarCampos, validarJWT, tieneRole } = require("../middlewares");

const router = Router();

router.get('/', productoGet);

router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProducto), // usar db-validator
    validarCampos
],productoGetOne);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id valido').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarCampos
],productoPost);

router.put('/:id', [
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
],productoPut);

router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN' , 'MOD'),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
],productoDelete);


module.exports = router;