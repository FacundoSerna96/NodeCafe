const { resolve } = require('path');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


const subirArchivo = (files, extensionesvalidas = ['png','jpeg','jpg', 'gif'], carpeta = '') => {

    return new Promise((resolve,reject) =>{
        const {archivo} = files;
        const nombreCortado = archivo.name.split('.');
    
        const extension = nombreCortado[nombreCortado.length - 1];
    
        //validar la extencion
        const extensionesValidas = extensionesvalidas;
    
        if(!extensionesValidas.includes(extension)){
            return reject(`La extension ${extension} no es permitida, ${extensionesValidas}`)
        }
    
        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname , '../uploads/', carpeta, nombreTemp);
    
        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }
    
           resolve(nombreTemp);
        }); 
    });
}


module.exports = {
    subirArchivo
}