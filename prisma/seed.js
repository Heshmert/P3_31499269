const API_URL = "http://localhost:3000";

async function seed() {
    console.log("🚀 Iniciando recuperación de base de datos...");

    try {
        // 1. REGISTRO (Para asegurar que el usuario exista tras el borrado de la DB)
        console.log("👤 Creando usuario principal...");
        const regRes = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                nombre: "Usuario Prueba",
                email: "usuario@gmail.com", 
                password: "12345678" 
            })
        });
        
        let authData = await regRes.json();
        let token = authData.data?.token;

        // Si ya existe, hacemos login para obtener el token
        if (!token) {
            console.log("🔑 El usuario ya existe, obteniendo sesión...");
            const loginRes = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: "usuario@gmail.com", password: "12345678" })
            });
            authData = await loginRes.json();
            token = authData.data?.token;
        }

        if (!token) throw new Error("No se pudo obtener el Token.");

        // 2. CREAR CATEGORÍA (Indispensable para el categoryId)
        console.log("📁 Creando categoría...");
        const catRes = await fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: "Literatura" })
        });
        const catData = await catRes.json();
        const catId = catData.data?.id || 1;

        // 3. CREAR PRODUCTO (Formato exacto OAS 3.0)
        console.log("📚 Creando productos...");
        const productos = [
            {
                name: "Don Quijote de la Mancha",
                description: "Alonso Quijano es un hidalgo que, tras leer demasiados libros de caballería, decide hacerse caballero andante.",
                price: 18,
                stock: 50,
                categoryId: catId,
                tagIds: [], 
                author: "Miguel de Cervantes",
                publisher: "Editorial Castalia",
                isbn: "9788470398131",
                language: "Español",
                format: "Tapa dura",
                year: 1605
            }
        ];

        for (const prod of productos) {
            const resProd = await fetch(`${API_URL}/admin/products`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(prod)
            });
            
            const result = await resProd.json();

            if (resProd.ok) {
                console.log(`✅ Creado: ${prod.name}`);
            } else {
                console.error(`❌ Error en ${prod.name}:`, result.data?.message || result);
            }
        }

        console.log("✨ Seed finalizado. DB lista.");

    } catch (error) {
        console.error("❌ Error crítico:", error.message);
    }
}

seed();