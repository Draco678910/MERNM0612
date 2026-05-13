import express from 'express';
const router = express.Router();

// Importa els controladors
import {
    loginUser,
    registerUser,
    logoutUser
} from '../controllers/user.controller.js';

// Importa el middleware per protegir les rutes privades.
import authMiddleware from '../middlewares/auth.middleware.js';

// Ruta per a l'autenticació d'usuaris (Login).
router.post('/login', loginUser);

// Ruta per a la creació de nous usuaris (Register).
router.post('/register', registerUser);

// Ruta per tancar la sessió (Logout).
router.post('/logout', logoutUser);

// Ruta protegida 
// router.get('/profile', authMiddleware, (req, res) => {
//     res.send('Perfil d’usuari protegit');
// });

// Exporta el router per defecte perquè pugui ser utilitzat a l'arxiu principal.
export default router;