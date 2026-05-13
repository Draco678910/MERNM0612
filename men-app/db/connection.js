import mongoose from "mongoose";
mongoose.set('sanitizeFilter', true);
mongoose.set('strictQuery', false)
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
// Importar les variables d'entorn 
// const {MONGODB_USER_NO_ROOT,MONGODB_PASSWORD_USER_NO_ROOT,MONGODB_HOST,MONGODB_DOCKER_PORT,MONGODB_DB} = process.env;
const { MONGODB_USER, MONGODB_PASSWORD, MONGO_DOCKER_PORT, MONGODB_HOST, MONGODB_DB } = process.env;
console.log('connection', process.env);

// Crear la url de connexió
// const url = `mongodb://${MONGODB_USER_NO_ROOT}:${MONGODB_PASSWORD_USER_NO_ROOT}@${MONGODB_HOST}:${MONGODB_DOCKER_PORT}/${MONGODB_DB}?authSource=${MONGODB_DB}`
const url = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGO_DOCKER_PORT}/${MONGODB_DB}?authSource=admin`
console.log(url);

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(url)

    console.log(`Database is connected: ${connection.connection.host}`)
  }
  catch (error) {
    console.log(error)
    process.exit(1)
  }
}

connectDB()