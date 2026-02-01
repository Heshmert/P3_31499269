const API_URL = process.env.PUBLIC_API_URL;

async function seed() {
    console.log("🚀 Iniciando recuperación total de base de datos...");

    try {
        // 1. REGISTRO/LOGIN
        console.log("👤 Configurando usuario...");
        const regRes = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                nombre: "Admin Prueba",
                email: "usuario@gmail.com", 
                password: "12345678" 
            })
        });
        
        let authData = await regRes.json();
        let token = authData.data?.token;

        if (!token) {
            const loginRes = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: "usuario@gmail.com", password: "12345678" })
            });
            authData = await loginRes.json();
            token = authData.data?.token;
        }

        if (!token) throw new Error("No se pudo obtener el Token.");
        const headers = { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        };

        // 2. CREAR 5 CATEGORÍAS (IDs esperados: 1 al 5)
        console.log("📁 Creando categorías...");
        const categorias = ["Literatura", "Ciencia Ficción", "Historia", "Tecnología", "Biografías"];
        for (const cat of categorias) {
            await fetch(`${API_URL}/categories`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ name: cat, description: `Libros de ${cat}` })
            });
        }

        // 3. CREAR 5 TAGS (IDs esperados: 1 al 5)
        console.log("🏷️ Creando etiquetas...");
        const tags = ["Best Seller", "Clásico", "Nuevo", "Oferta", "Recomendado"];
        for (const tag of tags) {
            await fetch(`${API_URL}/tags`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ name: tag })
            });
        }

        // 4. CREAR 5 PRODUCTOS
        console.log("📚 Creando productos...");
        const productos = [
            {
                name: "Don Quijote de la Mancha",
                description: "La obra cumbre de la lengua española.",
                price: 20, stock: 50, categoryId: 1, tagIds: [1, 2],
                author: "Miguel de Cervantes", publisher: "Castalia", isbn: "9781",
                language: "Español", format: "Tapa dura", year: 1605
            },
            {
                name: "Dune",
                description: "La épica de ciencia ficción en el planeta Arrakis.",
                price: 25, stock: 30, categoryId: 2, tagIds: [1, 3],
                author: "Frank Herbert", publisher: "Debolsillo", isbn: "9782",
                language: "Español", format: "Bolsillo", year: 1965
            },
            {
                name: "Breve historia del tiempo",
                description: "Exploración del cosmos y los agujeros negros.",
                price: 15, stock: 20, categoryId: 4, tagIds: [5],
                author: "Stephen Hawking", publisher: "Bantam", isbn: "9783",
                language: "Español", format: "Digital", year: 1988
            },
            {
                name: "Sapiens",
                description: "Una breve historia de la humanidad.",
                price: 22, stock: 40, categoryId: 3, tagIds: [1],
                author: "Yuval Noah Harari", publisher: "Debate", isbn: "9784",
                language: "Español", format: "Tapa blanda", year: 2011
            },
            {
                name: "Steve Jobs",
                description: "La biografía exclusiva del fundador de Apple.",
                price: 18, stock: 15, categoryId: 5, tagIds: [2, 5],
                author: "Walter Isaacson", publisher: "Simon & Schuster", isbn: "9785",
                language: "Español", format: "Tapa dura", year: 2011
            }
        ];

        for (const prod of productos) {
            const resProd = await fetch(`${API_URL}/admin/products`, {
                method: 'POST',
                headers,
                body: JSON.stringify(prod)
            });
            const result = await resProd.json();
            if (resProd.ok) console.log(`✅ Creado: ${prod.name}`);
            else console.error(`❌ Error en ${prod.name}:`, result);
        }

        console.log("✨ Base de Datos Restaurada con Éxito.");

    } catch (error) {
        console.error("❌ Error crítico:", error.message);
    }
}

seed();