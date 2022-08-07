const {Router} = require('express');
const { check } = require('express-validator');

const { 
        usuariosGet, 
        usuariosPost, 
        usuariosPut, 
        usuariosDelete, 
        usuarioGetOne
    } = require('../controllers/user');

const { emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');


const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares');

const router = Router();


router.get('/', usuariosGet)

router.get('/:id',[
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
],usuarioGetOne)

router.post('/', [
    check('correo', 'El correo no es valido').isEmail(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password tiene que tener mas de 6 caracteres').isLength({min:6}),
    check('correo').custom(emailExiste),
    validarCampos
], usuariosPost)


router.put('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
],usuariosPut)



router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN' , 'MOD'),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
],usuariosDelete)



module.exports= router;