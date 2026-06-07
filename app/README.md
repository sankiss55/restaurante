# ⚙️ Backend — Pedidos Restaurante

API REST construida con NestJS que gestiona toda la lógica del sistema: autenticación, mesas, órdenes, productos y comunicación en tiempo real con WebSockets.

---

## 📋 Tabla de Contenidos

- [Tecnologías](#-tecnologías)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Variables de entorno](#-variables-de-entorno)
- [Instalación con Docker](#-instalación-con-docker)
- [Endpoints](#-endpoints)
- [WebSockets](#-websockets)
- [Estados de una orden](#-estados-de-una-orden)

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| [NestJS](https://nestjs.com/) | Framework principal |
| [PostgreSQL](https://www.postgresql.org/) | Base de datos relacional |
| [TypeORM](https://typeorm.io/) | ORM para entidades y migraciones |
| [Docker](https://www.docker.com/) | Contenedorización del servidor y BD |
| [JWT](https://jwt.io/) | Autenticación y autorización por roles |
| [WebSockets](https://docs.nestjs.com/websockets/gateways) | Comunicación en tiempo real |
| [Swagger](https://swagger.io/) | Documentación interactiva de la API |

---

## 🗂️ Estructura del proyecto

```
app/src/
├── configs/          # Configuración (DB, JWT, etc.)
├── controllers/      # Controladores HTTP
├── decorators/       # Decoradores personalizados
├── dtos/             # Data Transfer Objects (validación)
├── dump_BD/          # Respaldos de la BD
├── entities/         # Entidades TypeORM
├── filters/          # Filtros de excepciones
├── gateways/         # WebSocket gateways
├── guards/           # Guards de autenticación JWT
├── responces/        # Modelos de respuesta estándar
├── services/         # Lógica de negocio
└── main.ts           # Punto de entrada
```

---

## 🔐 Variables de entorno

Crea un archivo `.env` en la raíz de `app/`. Estas variables son inyectadas automáticamente por Docker:

```env
# PostgreSQL
POSTGRES_USER=admin
POSTGRES_PASSWORD=tu_contraseña
POSTGRES_DB=restaurante
POOL_SIZE=10
HOST_DATABASE=db
PORT_DATBASE=5432

# Roles
KEY_ROLES=roles

# JWT
JWT_SECRET=tu_clave_secreta_segura
JWT_ISSUER=Restaurante_santan
```

> ⚠️ Nunca subas el `.env` al repositorio. Verifica que esté en `.gitignore`.

---

## 🐳 Instalación con Docker

```bash
# Desde la carpeta app/
cd app

# Primera vez o después de cambios en el código
docker compose up --build -d

# Solo reiniciar (sin reconstruir)
docker compose up -d

# Ver logs en tiempo real
docker compose logs -f

# Detener contenedores
docker compose down
```

La API estará disponible en: `http://localhost:3000`  
Documentación Swagger en: `http://localhost:3000/api`

> El `docker-compose.yml` levanta dos servicios: el servidor NestJS y PostgreSQL. Las variables del `.env` se inyectan automáticamente.

---

## 📡 Endpoints

La documentación completa e interactiva está en Swagger en `/api`. Resumen por módulo:

### App
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/` | Verificación que la API responda |

### Usuarios
| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/usuarios/CreateUser` | Crear nuevo usuario |
| POST | `/usuarios/login` | Inicio de sesión, retorna JWT |
| GET | `/usuarios` | Listar usuarios |

### Mesas
| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/mesas/crearMesas` | Crear nueva mesa |
| GET | `/mesas/traer_mesas` | Listar mesas con filtro |
| GET | `/mesas/mis_mesas/:idUsuario` | Mesas asignadas al mesero |
| GET | `/mesas/disponibles` | Mesas disponibles |
| PATCH | `/mesas/estado_atendida/:id` | Cambiar estado atendida/desocupada |
| PATCH | `/mesas/modificar_estado/:id` | Activar o desactivar mesa |
| PATCH | `/mesas/asignar/:idMesa/:idUsuario` | Asignar mesa a un mesero |

### Órdenes
| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/ordenes/crear_orden` | Crear orden básica |
| POST | `/ordenes/crear_orden_completa` | Crear orden con detalles |
| POST | `/ordenes/listar/estados` | Obtener órdenes por estados |
| PATCH | `/ordenes/:id/estado` | Cambiar estado de una orden |
| PATCH | `/ordenes/:id/marcar-pagado` | Marcar orden como pagada |
| DELETE | `/ordenes/cancelar/:id` | Cancelar una orden |
| DELETE | `/ordenes/detalles/:id` | Eliminar un detalle de orden |

### Productos
| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/productos/crear_producto` | Crear producto |
| GET | `/productos/buscar` | Buscar productos con filtros |
| PATCH | `/productos/modificar/:id` | Modificar producto |
| PATCH | `/productos/cambiar_disponibilidad/:id` | Activar/desactivar disponibilidad |

### Categorías
| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/categorias/crear_categoria` | Crear categoría |
| GET | `/categorias/all_categorias` | Listar categorías |
| PATCH | `/categorias/modificar_info` | Actualizar categoría |
| DELETE | `/categorias/eliminar_categoria/:id` | Eliminar categoría |

### Detalles de Órdenes
| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/detalles_ordenes/crear_detalle` | Crear detalle de orden |

---

## 🔌 WebSockets

El servidor emite los siguientes eventos en tiempo real:

| Evento | Descripción | Quién lo recibe |
|---|---|---|
| `actualizacion-orden` | Nueva orden o cambio de estado | Cocina, mesero |
| `mesa-liberada` | Mesa desocupada al pagar | Meseros |

---

## 🔄 Estados de una orden

```
1. Pendiente  ──►  2. Preparando  ──►  3. Listo  ──►  5. Pagada
                                            │
                                            └──►  4. Cancelada
```

| ID | Estado | Quién lo asigna |
|---|---|---|
| 1 | Pendiente | Se asigna al crear la orden |
| 2 | Preparando | Cocinero |
| 3 | Listo | Cocinero |
| 4 | Cancelada | Sistema |
| 5 | Pagada | Mesero |
