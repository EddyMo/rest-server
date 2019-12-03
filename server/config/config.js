// =======================
// Puerto
// =======================

process.env.PORT = process.env.PORT || 3000;

// =======================
// Entorno
// =======================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =======================
// Vencimiento del Token
// =======================
//process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.CADUCIDAD_TOKEN = '48h';

// =======================
// SEED de autenticacion
// =======================
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';

// =======================
// Base de Datos
// =======================

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

// =======================
// Coogle Client ID
// =======================
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '180289616931-ahq20r3v7hl1epegp2qc98mgnc60pbpj.apps.googleusercontent.com';