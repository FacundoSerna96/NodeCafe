const validaroles = require('../middlewares/validarRoles');
const validarJWT = require('../middlewares/validar-jwt');
const validarcampos = require('../middlewares/validarCampos');
const validarArchivoSubir = require('../middlewares/validarArchivo');

module.exports = {
    ...validarcampos,
    ...validarJWT,
    ...validaroles,
    ...validarArchivoSubir
}