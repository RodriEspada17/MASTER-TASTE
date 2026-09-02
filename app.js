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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. LÓGICA: PANTALLA CREAR SALA
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
                await setDoc(doc(db, "salas", codigoSala), {
                    codigo_sala: codigoSala,
                    marca: marcaSeleccionada,
                    lote_producto: codigoProducto,
                    creada_el: new Date(),
                    estado: "activa"
                });
                window.location.href = `evaluacion.html?codigo=${codigoSala}&marca=${marcaSeleccionada}&prod=${codigoProducto}`;
            } catch (error) {
                console.error(error);
                alert("Error al crear sala.");
                btnCrearSala.innerHTML = `CREAR SALA Y COMENZAR <span class="ml-2">›</span>`;
            }
        });
    }

    // ==========================================
    // 2. LÓGICA: PANTALLA EVALUACIÓN
    // ==========================================
    const contenedorDefectos = document.getElementById('contenedorDefectos');
    if(contenedorDefectos) {
        // Variables para la cata
        let defectoSeleccionado = "";
        let intensidadSeleccionada = "";
        let demeritosAgregados = []; // Aquí guardaremos la lista

        const urlParams = new URLSearchParams(window.location.search);
        const codigo = urlParams.get('codigo') || '------';
        document.getElementById('displayCodigo').innerText = codigo;
        document.getElementById('tituloMarca').innerText = `${urlParams.get('marca') || 'MARCA'} - ${urlParams.get('prod') || 'P000'}`;

        const listaDefectos = [
            "Sulfuroso de dimetilo (DMS)", "Ácido sulfhídrico", "Trisulfuro de dimetilo (DMTS)",
            "Dióxido de azufre", "Lightstruck (golpe de luz)", "Acetato de isoamilo",
            "Ácido butírico", "Ácido isovalérico", "Ácido acético", "Bicarbonato de sodio",
            "Oxidación", "Diacetilo", "Metálico", "Astringente"
        ];

        // Crear botones de defectos
        listaDefectos.forEach(defecto => {
            const btn = document.createElement('button');
            btn.className = 'defecto-btn border border-green-800 p-2 rounded text-sm text-gray-300 text-left truncate';
            btn.innerText = defecto;
            
            btn.addEventListener('click', () => {
                document.querySelectorAll('.defecto-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                defectoSeleccionado = defecto; // Guardamos el nombre
            });
            contenedorDefectos.appendChild(btn);
        });

        // Seleccionar intensidad
        document.querySelectorAll('.intensidad-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.intensidad-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                intensidadSeleccionada = e.target.innerText; // Guardamos el valor (ej. "3 - Medio")
            });
        });

        // BOTÓN: AGREGAR DEMÉRITO
        const btnAgregarDemerito = document.getElementById('btnAgregarDemerito');
        const listaUI = document.getElementById('listaDemeritos');

        btnAgregarDemerito.addEventListener('click', () => {
            if(!defectoSeleccionado || !intensidadSeleccionada) {
                alert("⚠️ Por favor, selecciona un defecto y su intensidad.");
                return;
            }

            // Agregamos al array
            demeritosAgregados.push({
                defecto: defectoSeleccionado,
                intensidad: intensidadSeleccionada
            });

            actualizarListaUI();

            // Limpiar selección para el siguiente defecto
            defectoSeleccionado = "";
            intensidadSeleccionada = "";
            document.querySelectorAll('.defecto-btn, .intensidad-btn').forEach(b => b.classList.remove('active'));
        });

        // Función para pintar la lista
        function actualizarListaUI() {
            if(demeritosAgregados.length > 0) {
                listaUI.classList.remove('hidden');
            } else {
                listaUI.classList.add('hidden');
            }

            // Limpiamos el HTML anterior
            listaUI.innerHTML = `<h2 class="text-xs text-gray-400 uppercase tracking-wider mb-3">Deméritos Registrados (${demeritosAgregados.length})</h2>`;

            // Dibujamos cada defecto agregado
            demeritosAgregados.forEach((item, index) => {
                // Sacamos solo la palabra (ej: "Extremo" de "5 - Extremo")
                const intensidadCorta = item.intensidad.split('- ')[1] || item.intensidad;

                const div = document.createElement('div');
                div.className = "border border-green-800 bg-[#051307] p-3 rounded flex justify-between items-center";
                div.innerHTML = `
                    <div class="flex items-center">
                        <span class="text-green-500 mr-3">⚗️</span>
                        <div>
                            <p class="font-bold text-sm">${item.defecto}</p>
                            <span class="bg-purple-900 text-purple-200 text-xs px-2 py-0.5 rounded">${intensidadCorta}</span>
                        </div>
                    </div>
                    <button class="text-gray-500 hover:text-red-500 btn-eliminar" data-index="${index}">🗑️</button>
                `;
                listaUI.appendChild(div);
            });

            // Darle función a los botones de basurero (Eliminar)
            document.querySelectorAll('.btn-eliminar').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = e.target.getAttribute('data-index');
                    demeritosAgregados.splice(idx, 1); // Borrar del array
                    actualizarListaUI(); // Volver a pintar
                });
            });
        }
    }
});