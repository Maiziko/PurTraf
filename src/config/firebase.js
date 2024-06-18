import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { initializeAuth, getReactNativePersistence } from "firebase/auth"
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "AIzaSyAHceF7g_Xh0_BYKJbhU_QfSiGKlMEqlvc",
    authDomain: "purtraf-dd96d.firebaseapp.com",
    databaseURL: "https://purtraf-dd96d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "purtraf-dd96d",
    storageBucket: "purtraf-dd96d.appspot.com",
    messagingSenderId: "229695851215",
    appId: "1:229695851215:web:b9106af97e4b50c27305ba",
    measurementId: "G-K1E26JHPE5"
};

// fungsi initializeApp dengan objek firebaseConfig bertindak sebagai argumen untuk menginisialisasi Firebase dalam 
// aplikasi. Hasil inisialisasi disimpan dalam variabel app
const app = initializeApp(firebaseConfig);

// getFirestore digunakan untuk menginisialisasi layanan Firebase Firestore, yang merupakan basis data Firebase. 
// Hasil inisialisasi disimpan dalam variabel firestore.
export const firestore = getFirestore(app)

// getStorage ini digunakan untuk menginisialisasi layanan Firebase Storage, 
// yang digunakan untuk menyimpan dan mengelola berkas di Firebase. 
// Hasil inisialisasi disimpan dalam variabel storage. 
// Layanan ini berguna ketika kita ingin menyimpan berkas seperti gambar atau dokumen.
export const storage = getStorage(app)

// initializeAuth: digunakan untuk menginisialisasi layanan Firebase Authentication. 
// kita juga mengatur opsi persistence ke getReactNativePersistence(ReactNativeAsyncStorage). 
// menyimpan sesi otentikasi pengguna di perangkat dengan 
// menggunakan React Native Async Storage. 
export const firebaseAuth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})