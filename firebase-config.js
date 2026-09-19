// ============================================================
// FIREBASE REALTIME DATABASE CONFIGURATION
// ============================================================
// Buat project gratis di https://console.firebase.google.com/
// Pilih "Realtime Database" -> Create Database -> Start in test mode
// Masukkan konfigurasi Anda di bawah ini:

const firebaseConfig = {
  apiKey: "AIzaSyAtrtW5NIJnXgQvImw2wYGuzYg-IMV4weA",
  authDomain: "progress-siswa.firebaseapp.com",
  databaseURL: "https://progress-siswa-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "progress-siswa",
  storageBucket: "progress-siswa.firebasestorage.app",
  messagingSenderId: "624834205432",
  appId: "1:624834205432:web:a4afe57aab17e4a80f4d0d",
  measurementId: "G-2BP0SQW2CS"
};

// Inisialisasi Firebase
let db = null;
let isFirebaseReady = false;

try {
  if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    db = firebase.database();
    isFirebaseReady = true;
  }
} catch (err) {
  console.warn('Firebase init error (silakan isi firebaseConfig yang valid):', err);
}
