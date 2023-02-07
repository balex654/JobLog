import "reflect-metadata";
import http from 'http';
import express, { Express } from 'express';
import routes from './routes';
const { auth } = require('express-oauth2-jwt-bearer');
require('dotenv').config();

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

const jwtCheck = auth({
    audience: 'https://ride-track-backend-gol2gz2rwq-uc.a.run.app',
    issuerBaseURL: 'https://dev-2uer6jn7.us.auth0.com/',
    tokenSigningAlg: 'RS256'
});

// enforce on all endpoints
router.use(jwtCheck);

router.get('/authorized', function (req, res) {
    res.send('Secured Resource');
});

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
        return res.status(200).json({});
    }
    next();
});

router.use('/', routes);

router.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});

const httpServer = http.createServer(router);
httpServer.listen(8000, () => console.log("Server is listening"))
