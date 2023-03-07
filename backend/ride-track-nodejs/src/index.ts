import "reflect-metadata";
import http from 'http';
import express, { Express } from 'express';
import routes from './routes';
const { auth } = require('express-oauth2-jwt-bearer');
require('dotenv').config();
const cors = require('cors');

export const knex = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        port: 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'ride_track'
    }
});

const router: Express = express();
router.use(cors({
    origin: ['http://localhost:3000', 'https://ride-track-frontend-gol2gz2rwq-uc.a.run.app', 'capacitor://localhost', 'http://192.168.0.2:8100']
}));

const jwtCheck = auth({
    audience: 'https://ride-track-backend-gol2gz2rwq-uc.a.run.app',
    issuerBaseURL: 'https://dev-2uer6jn7.us.auth0.com/',
    tokenSigningAlg: 'RS256'
});

router.use(jwtCheck);

router.get('/authorized', function (req, res) {
    res.send('Secured Resource');
});

router.use(express.json({limit: '1gb'}));
router.use(express.urlencoded({ limit: '1gb', extended: false }));

router.use('/', routes);

const httpServer = http.createServer(router);
httpServer.listen(8000, () => console.log("Server is listening"))
