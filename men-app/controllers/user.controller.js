import bcrypt from 'bcryptjs';
import User from '../db/models/user.schema.js';
import jwt from 'jsonwebtoken';

const loginUser = async (req, res) => {
    try {
        // Recupera l'email i la password del cos de la petició (body).
        const { email, password } = req.body;
        // Valida que l'email tingui un format correcte i la password compleixi els requisits 
        // (mínim 8 caràcters, lletres majúscules, minúscules, números i símbols) mitjançant Regex.
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Email no vàlid' });
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: 'Contrasenya no valida'
            });
        }
        // Cerca l'usuari a la base de dades pel seu email.
        // Si l'usuari no existeix, llança una excepció informant que no està registrat.
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: 'El usuari no existeix'
            });
        }

        // Crea un objecte 'profile' amb les dades de l'usuari (_id, name, surname, email).
        const profile = {
            _id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email
        };


        // Genera un token JWT signat amb el perfil de l'usuari, una clau secreta de les 
        // variables d'entorn i una durada d'un dia.
        const token = jwt.sign(
            { profile },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );


        // Compara la password rebuda amb la password encriptada de la base de dades usant bcrypt.
        // Si no coincideixen, llança una excepció d'error d'autenticació.
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Password incorrecta'
            });
        }

        // Si tot és correcte, configura una cookie anomenada 'jwt' amb el token.
        // La cookie ha de ser httpOnly, segura, amb sameSite 'lax' i una caducitat de 24 hores.
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        // Retorna una resposta JSON confirmant l'autenticació.
        res.status(200).json({
            message: 'Autenticació confirmada',
            profile
        });


    } catch (error) {
        // Gestiona els errors retornant un JSON amb el missatge d'error.
        return res.status(500).json({
            message: error.message
        });
    }
};

async function registerUser(req, res) {
    try {
        // Crea una nova instància del model User amb les dades rebudes al body.
        const newUser = new User(req.body);

        // Valida les dades de l'usuari sincronament segons l'esquema de Mongoose.
        // UTilitzando el mètode validateSync() de Mongoose, 
        // Captura els errors de validació i retorna un JSON amb els missatges d'error per a cada camp.
        const validationError = newUser.validateSync();

        if (validationError) {
            const errors = {};
            for (let field in validationError.errors) {
                errors[field] = validationError.errors[field].message;
            }
            return res.status(400).json({
                errors
            });
        }

        // Comprova si ja existeix un usuari amb el mateix correu electrònic.
        // Si existeix, llança un error indicant que l'usuari ja està registrat.
        const existingUser = await User.findOne({
            email: newUser.email
        });

        if (existingUser) {
            throw new Error('L’usuari ja està registrat');
        }

        // Encripta la contrasenya de l'usuari amb bcrypt (10 salts).
        newUser.password = await bcrypt.hash(newUser.password, 10);

        // Desa el nou usuari a la base de dades.
        await newUser.save();

        // Retorna una resposta JSON confirmant la creació del compte.
        return res.status(201).json({
            message: 'Compte creat correctament'
        });

    } catch (error) {
        // Si l'error és de validació de Mongoose (ValidationError), retorna un status 400 
        // amb un objecte que contingui els missatges d'error per a cada camp.
        // Per a altres errors, retorna un status 500.
        if (error.name === 'ValidationError') {
            const errors = {};
            for (let field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            return res.status(400).json({
                errors
            });
        }
        return res.status(500).json({
            message: error.message
        });
    }
}

const logoutUser = async (req, res) => {
    // Esborra la cookie 'jwt' configurant les mateixes opcions (httpOnly, sameSite, secure).
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax'
    });
    // Retorna un missatge confirmant el tancament de la sessió.
    return res.status(201).json({
        message: 'Sesió tamcada correctament'
    });
};

// Exporta totes les funcions per poder-les utilitzar en el fitxer de rutes.
export { loginUser, registerUser, logoutUser };