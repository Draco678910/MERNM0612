import mongoose from "mongoose";
const { Schema, model } = mongoose;

// Defineix l'esquema d'usuari (userSchema).
const userSchema = new Schema(
  {
    // Camp 'name': ha de ser de tipus String.
    name: {
      type: String,
    },

    // Camp 'surname': ha de ser String i obligatori amb un missatge personalitzat.
    surname: {
      type: String,
      required: [true, "Aquest camp és obligatori"],
    },

    // Camp 'email': ha de ser String, obligatori i únic.
    // Afegeix una validació personalitzada (validate) que utilitzi una expressió regular
    // per comprovar que el format del correu és correcte.
    email: {
      type: String,
      required: [true, "El correu és obligatori"],
      validate: {
        validator: (value) => {
          // Retorna el test d'una expressió regular per validar l'email.
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: props => `${props.value} no es un correu valid!`
      },
    },

    // Camp 'password': ha de ser String i obligatori.
    // Afegeix una validació personalitzada que comprovi que la contrasenya té:
    // Almenys 8 caràcters, una majúscula, una minúscula, un número i un símbol.
    password: {
      type: String,
      required: [true, "La contrasenya és obligatòria"],
      validate: {
        validator: function (value) {
          // Retorna el test d'una expressió regular per validar la complexitat de la password.
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(value);
        },
        message: `Aquesta contrasenya no es valida!`
      },
    },
  },
  {
    // Configura l'opció timestamps per gestionar automàticament 'createdAt' i 'updatedAt'.
    timestamps: true
  }
);

// Exporta el model de Mongoose anomenat 'User' utilitzant l'esquema definit.
export default model('User', userSchema);