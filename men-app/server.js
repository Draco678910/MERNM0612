import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();
// Importa el fitxer de connexió a la base de dades perquè s'executi.
// Importa les rutes
import './db/connection.js';
import userRoutes from './routes/user.routes.js';

const app = express();

// // Configura el middleware de CORS:
// app.use(cors({ 
//     /* Origen permès */
//     /* Permetre credencials */ 
// }));

app.use(cors({
  origin: 'http://localhost:3000', // Origen permès (frontend React)
  credentials: true               // Permetre cookies / sessions
}));

// // Configura el parser per poder llegir fitxers JSON al cos de les peticions.
// app.use(/* */);

app.use(express.json());

// // Configura el parser de cookies per poder accedir a req.cookies.
// app.use(/*  */);

app.use(cookieParser());

// Comprova que el servidor està responent correctament
app.get('/', (req, res) => {
  // Resposta que s'envia al client
  res.send('Petició GET rebuda a la ruta arrel');
});

// Configura els punts d'entrada de les rutes:
// Les rutes d'usuaris han de penjar de '/users'.
app.use('/users', userRoutes);

// app.post('/users/login', (req, res) => {
//   // Resposta que s'envia al client
//   res.send('POST Request for Login');
// });

// app.post('/users/register', (req, res) => {
//   // Resposta que s'envia al client
//   res.send('POST Request for Register');
// });

// Les rutes de notes han de penjar de '/notes'.

// Defineix el port del servidor a partir de la variable d'entorn NODE_DOCKER_PORT.
const PORT = process.env.NODE_DOCKER_PORT || 8081;

// Aixeca el servidor i mostra un missatge per consola indicant que s'està executant i en quin port.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});