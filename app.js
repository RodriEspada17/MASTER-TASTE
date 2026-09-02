import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// === TUS LLAVES DE FIREBASE ===
const firebaseConfig = {
  apiKey: "AIzaSyDA83ViuFfslQWi6YJoTIGdCDQ1AGAzF0I",
  authDomain: "master-taste.firebaseapp.com",
  projectId: "master-taste",
  storageBucket: "master-taste.firebasestorage.app",
  messagingSenderId: "773340851535",
  appId: "1:773340851535:web:3f3d2d77a7df953c6ae93a",
  measurementId: "G-W6J5775TH6"
};
// ========================================

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // LÓGICA: PANTALLA CREAR SALA
    // ==========================================
    const btnCrearSala = document.getElementById('btnCrearSala');
    if(btnCrearSala) {
        let marcaSeleccionada = "";
        const botonesMarcaReales = document.querySelectorAll('.grid-cols-3 button');

        botonesMarcaReales.forEach(btn => {
            btn.addEventListener('click', (e) => {
                botonesMarcaReales.forEach(b => {
                    b.classList.remove('bg-green-500', 'text-black', 'font-bold');
                    b.classList.add('text-gray-300');
                });
                e.target.classList.add('bg-green-500', 'text-black', 'font-bold');
                e.target.classList.remove('text-gray-300');
                marcaSeleccionada = e.target.innerText;
            });
        });

        btnCrearSala.addEventListener('click', async () => {
            if(!marcaSeleccionada) { alert("Selecciona una marca."); return; }
            const codigoProducto = document.getElementById('codigoProducto').value || "S/C";
            const codigoSala = Math.random().toString(36).substring(2, 8).toUpperCase();
            
            btnCrearSala.innerText = "Creando sala...";
            try {
                // Guardar la sala en tu Firebase
                await setDoc(doc(db, "salas", codigoSala), {
                    codigo_sala: codigoSala,
                    marca: marcaSeleccionada,
                    lote_producto: codigoProducto,
                    creada_el: new Date(),
                    estado: "activa"
                });
                // Redirigir enviando los datos por la URL
                window.location.href = `evaluacion.html?codigo=${codigoSala}&marca=${marcaSeleccionada}&prod=${codigoProducto}`;
            } catch (error) {
                console.error(error);
                alert("Error al crear sala.");
                btnCrearSala.innerHTML = `CREAR SALA Y COMENZAR <span class="ml-2">›</span>`;
            }
        });
    }

    // ==========================================
    // LÓGICA: PANTALLA EVALUACIÓN
    // ==========================================
    const contenedorDefectos = document.getElementById('contenedorDefectos');
    if(contenedorDefectos) {
        // Leer datos de la URL (Ej: evaluacion.html?codigo=1234AB&marca=Amstel)
        const urlParams = new URLSearchParams(window.location.search);
        const codigo = urlParams.get('codigo') || '------';
        const marca = urlParams.get('marca') || 'MARCA';
        const prod = urlParams.get('prod') || 'P000';

        // Mostrar datos en la barra superior
        document.getElementById('displayCodigo').innerText = codigo;
        document.getElementById('tituloMarca').innerText = `${marca} - ${prod}`;

        // Lista de defectos predefinidos
        const listaDefectos = [
            "Sulfuroso de dimetilo (DMS)", "Ácido sulfhídrico", "Trisulfuro de dimetilo (DMTS)",
            "Dióxido de azufre", "Lightstruck (golpe de luz)", "Acetato de isoamilo",
            "Ácido butírico", "Ácido isovalérico", "Ácido acético", "Bicarbonato de sodio",
            "Oxidación", "Diacetilo", "Metálico", "Astringente"
        ];

        // Pintar botones de defectos
        listaDefectos.forEach(defecto => {
            const btn = document.createElement('button');
            btn.className = 'defecto-btn border border-green-800 p-2 rounded text-sm text-gray-300 text-left truncate';
            btn.innerText = defecto;
            
            // Efecto de selección
            btn.addEventListener('click', () => {
                document.querySelectorAll('.defecto-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
            contenedorDefectos.appendChild(btn);
        });

        // Efecto de selección para intensidad
        document.querySelectorAll('.intensidad-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.intensidad-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }
});