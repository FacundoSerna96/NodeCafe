const dbValidatos = require('./db-validators');
const generarJwt = require('./generarJWT');
const googleVerify = require('./google-verify');
const subirArchivo = require('./subir-archivo');

module.exports = {
    ...dbValidatos,
    ...generarJwt,
    ...googleVerify,
    ...subirArchivo
}