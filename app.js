// 1. IMPORTAR FIREBASE (Versión modular para web)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// === Pega tu firebaseConfig aquí abajo 👇 ===
const firebaseConfig = {
  apiKey: "AIzaSyDA83ViuFfslQWi6YJoTIGdCDQ1AGAzF0I",
  authDomain: "master-taste.firebaseapp.com",
  projectId: "master-taste",
  storageBucket: "master-taste.firebasestorage.app",
  messagingSenderId: "773340851535",
  appId: "1:773340851535:web:3f3d2d77a7df953c6ae93a",
  measurementId: "G-W6J5775TH6"
};
// ============================================

// 2. INICIALIZAR FIREBASE Y BASE DE DATOS
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3. LÓGICA DE LA PANTALLA "CREAR SALA"
document.addEventListener('DOMContentLoaded', () => {
    
    // Variables para guardar lo que el usuario elige
    let tipoSeleccionado = "Producto Terminado"; 
    let marcaSeleccionada = "";

    // Seleccionar Marca
    const botonesMarca = document.querySelectorAll('button:contains("Amstel"), button:contains("Schneider"), button:contains("Capital"), button:contains("Real"), button:contains("Cordillera"), button:contains("Malta Real")');
    // Como querySelectorAll con :contains no es nativo, lo hacemos buscando por los botones de marca
    const botonesMarcaReales = document.querySelectorAll('.grid-cols-3 button');

    botonesMarcaReales.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Quitar el color verde a todos
            botonesMarcaReales.forEach(b => {
                b.classList.remove('bg-green-500', 'text-black', 'font-bold');
                b.classList.add('text-gray-300');
            });
            // Ponerle color verde al seleccionado
            e.target.classList.add('bg-green-500', 'text-black', 'font-bold');
            e.target.classList.remove('text-gray-300');
            marcaSeleccionada = e.target.innerText;
        });
    });

    // Botón Final "CREAR SALA Y COMENZAR"
    const btnCrearSala = document.getElementById('btnCrearSala');
    if(btnCrearSala) {
        btnCrearSala.addEventListener('click', async () => {
            if(!marcaSeleccionada) {
                alert("Por favor, selecciona una marca.");
                return;
            }

            const codigoProducto = document.getElementById('codigoProducto').value || "Sin código";
            
            // Generar código aleatorio de 6 caracteres (Ej: 4267CD)
            const codigoSala = Math.random().toString(36).substring(2, 8).toUpperCase();
            
            // Cambiar el texto del botón mientras carga
            btnCrearSala.innerText = "Creando sala...";

            try {
                // Guardar en la base de datos de Firebase
                await setDoc(doc(db, "salas", codigoSala), {
                    codigo_sala: codigoSala,
                    tipo: tipoSeleccionado,
                    marca: marcaSeleccionada,
                    lote_producto: codigoProducto,
                    creada_el: new Date(),
                    estado: "activa"
                });

                // Redirigir a la pantalla de evaluación pasándole el código por la URL
                window.location.href = `evaluacion.html?codigo=${codigoSala}&rol=creador`;

            } catch (error) {
                console.error("Error creando la sala: ", error);
                alert("Hubo un error al crear la sala.");
                btnCrearSala.innerHTML = `CREAR SALA Y COMENZAR <span class="ml-2">›</span>`;
            }
        });
    }
});
