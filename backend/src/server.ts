import express, { Request, Response, ErrorRequestHandler } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import apiRoutes from './routes/routes';

dotenv.config();

const server = express();

server.use(cors());

server.use(express.static(path.join(__dirname, '../public')));

const rateLimit = require('express-rate-limit');

// Configuração do limitador
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 100, // Máximo de 100 requisições por IP
    message: "Muitas requisições do mesmo IP. Tente novamente mais tarde.",
});

// Aplicando o limitador a todas as rotas
server.use('/api/', limiter);

const fs = require('fs');
const morgan = require('morgan');

// Configuração do stream de logs
const accessLogStream = fs.createWriteStream('./access.log', { flags: 'a' });

// Aplicando morgan para logar todas as requisições
server.use(morgan('combined', { stream: accessLogStream }));

//AQUI EU DIGO O FORMATO QUE EU QUERO A REQUISIÇÃO
//server.use(express.urlencoded({ extended: true })); // USANDO URL ENCODED
server.use(express.json()); //USANDO JSON

server.get('/ping', (req: Request, res: Response) => res.json({ pong: true }));

server.use(apiRoutes);

server.use((req: Request, res: Response) => {
    res.status(404);
    res.json({ error: 'Endpoint não encontrado.' });
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(400); // Bad Request
    console.log(err);
    res.json({ error: 'Ocorreu algum erro.' });
}
server.use(errorHandler);

server.listen(process.env.PORT);