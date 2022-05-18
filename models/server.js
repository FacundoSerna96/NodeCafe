const express = require('express')
let cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');


class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:       '/api/auth',
            usuarios :  '/api/usuarios',
            categorias: '/api/categorias',
            productos : '/api/productos',
            buscar : '/api/buscar',
            uploads : '/api/uploads'
        }

       /*  this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';
        this.categoriasPath = '/api/categorias'; */

        //Conectando a la base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //rutas de mi aplicacion
        this.route();
    }

    async conectarDB(){
        await dbConnection();
    }


    middlewares(){
        //CORS
        this.app.use(cors())

        //Parseo y lectura del body
        this.app.use(express.json());

        //directorio publico
        this.app.use(express.static('public'))

        //manejar la carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    route(){
        this.app.use(this.paths.usuarios, require('../routes/user'));
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'))  
        this.app.use(this.paths.buscar, require('../routes/buscar'))
        this.app.use(this.paths.uploads, require('../routes/uploads'))  
    }

    listen(){
        this.app.listen(this.port   , () =>{
            console.log(`Escuchando en el puerto ` + this.port);
        }) 
    }

}


module.exports = Server;