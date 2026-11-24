Sistema de Cine - Backend (Actividad 3.1)

Programas usados:
- Node.js v18+
- MySQL 8.0
- npm

Instalacion:
1. Clonar el repositorio.
2. Ejecutar: npm install
3. Crear archivo .env en la raiz con la siguiente estructura:

PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=cine_db
JWT_SECRET=cambiarFraseSecreta
JWT_EXPIRES_IN=8h

4. Ejecutar migracion: npm run migrate
   (crea la base de datos, tablas y usuario admin inicial: admin@cine.com / admin123)

5. Iniciar servidor: npm start
   (o npm run dev para desarrollo con nodemon)

Endpoints publicos (sin login):
- GET /peliculas
- GET /peliculas/grupo/ultimas5
- GET /peliculas/:id
- GET /funciones
- GET /funciones/:id
- GET /salas
- GET /salas/:id
- POST /auth/register
- POST /auth/login

Vistas EJS: /, /vistas/login, /vistas/register, /vistas/peliculas, /vistas/salas, /vistas/funciones, /vistas/tickets, /vistas/reservaciones, /vistas/usuarios

Roles: admin, empleado, cliente. Las operaciones protegidas requieren header Authorization: Bearer <token>.

Video demostrativo: https://www.youtube.com/watch?v=REEMPLAZAR
Etiquetas: #univalledelmomboy #tareaUVM
