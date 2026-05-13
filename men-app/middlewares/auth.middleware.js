import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    try {
        // Recupera el token JWT des de les cookies de la petició.
        // El nom de la cookie ha de coincidir amb el que has configurat al login.
        const token = req.cookies.token;

        // Utilitza 'jwt' per comprovar que el token és vàlid.
        // Necessitaràs el token i la clau secreta guardada a les variables d'entorn.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Si el token és vàlid, guarda el contingut descodificat (payload) 
        // dins de l'objecte de la petició 'req.user'. 
        // Això permetrà que els controladors següents sàpiguen quin usuari està actiu.
        req.user = decoded;

        // Si tot és correcte, crida a la funció 'next()' per passar al següent controlador.
        next();

    } catch (error) {
        // Si el token no existeix, ha caducat o és invàlid, captura l'error.
        // Retorna un codi d'estat 400 o 401 i un JSON informant que l'accés no està autoritzat.
        return res.status(401).json({
            message: 'Accés no autoritzat'
        });
    }
};

// Exporta el middleware per defecte per poder-lo aplicar a les rutes privades.
export default authMiddleware;