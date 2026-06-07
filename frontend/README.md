# 🎨 Frontend — Pedidos Restaurante

Interfaz de usuario construida con React y TypeScript. Organizada por roles (admin, mesero, cocina) con comunicación en tiempo real mediante WebSockets.

---

## 📋 Tabla de Contenidos

- [Tecnologías](#-tecnologías)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Variables de entorno](#-variables-de-entorno)
- [Instalación y ejecución](#-instalación-y-ejecución)
- [Módulos por rol](#-módulos-por-rol)
- [Hooks principales](#-hooks-principales)
- [Créditos](#-créditos)

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| [React](https://react.dev/) | Librería de interfaz de usuario |
| [TypeScript](https://www.typescriptlang.org/) | Tipado estático |
| [Vite](https://vitejs.dev/) | Bundler y servidor de desarrollo |
| [Tailwind CSS](https://tailwindcss.com/) | Estilos utilitarios |
| [Docker](https://www.docker.com/) | Contenedorización del frontend |
| [Lucide React](https://lucide.dev/) | Iconografía |
| [Socket.IO Client](https://socket.io/) | Comunicación en tiempo real |
| [React Router](https://reactrouter.com/) | Navegación entre páginas |
| [Axios](https://axios-http.com/) | Llamadas HTTP a la API |

---

## 🗂️ Estructura del proyecto

```
frontend/src/
├── components/         # Componentes reutilizables globales
├── context/            # AuthContext (sesión y JWT)
├── hooks/              # Hooks globales (useToast, useWebSocket...)
├── layouts/            # Layouts por rol (Admin, Mesero, Cocina)
├── modules/
│   ├── admin/          # Páginas del administrador
│   │   └── pages/      # Mesas, Productos, Categorías, Usuarios
│   ├── mesero/         # Módulo del mesero
│   │   ├── components/ # SelectorMesas, ProductoMenu, ResumenPedido...
│   │   ├── hooks/      # useMeseroMesas, usePedido
│   │   ├── pages/      # NuevoPedido
│   │   └── services/   # meseroService
│   └── cocina/         # Módulo de cocina
│       ├── components/ # TarjetaOrdenCocina
│       └── pages/      # PedidosActivos
├── pages/              # Páginas globales (Login, Dashboard)
├── services/           # Llamadas a la API REST
└── utils/              # Utilidades (imageUpload, etc.)
```

---

## 🔐 Variables de entorno

Crea un archivo `.env` en la raíz de `frontend/`:

```env
VITE_API_URL=http://localhost:3000
```

> ⚠️ Las variables en Vite deben empezar con `VITE_` para ser accesibles en el código. Nunca subas el `.env` al repositorio.

---

## 🚀 Instalación y ejecución

### Opción 1 — Docker (recomendado)

```bash
# Desde la carpeta frontend/
cd frontend

# Primera vez o después de cambios en el código
docker compose up --build -d

# Solo reiniciar (sin reconstruir)
docker compose up -d

# Ver logs en tiempo real
docker compose logs -f

# Detener contenedores
docker compose down
```

### Opción 2 — Desarrollo local

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo con hot reload
npm run dev

# Compilar para producción
npm run build
```

El frontend estará disponible en: `http://localhost:5173`

> **Nota:** El `dockerfile` usa `node:22`. Si usas desarrollo local, asegúrate de tener Node.js v20 o superior instalado.

---

## 👥 Módulos por rol

### 🧑‍💼 Admin (`/modules/admin`)
- **DashboardHome** — métricas generales: ganancias, órdenes, productos más vendidos, distribución de usuarios
- **MesasAdmin** — crear, activar/desactivar mesas
- **ProductosAdmin** — gestión de productos con imagen
- **CategoriasAdmin** — gestión de categorías
- **UsuariosAdmin** — gestión de usuarios del sistema

### 🧑‍🍽️ Mesero (`/modules/mesero`)
- **NuevoPedido** — panel de 3 columnas:
  - Izquierda: selector de mesas disponibles en tiempo real
  - Centro: catálogo de productos con búsqueda y filtros por categoría
  - Derecha: resumen del pedido y órdenes activas de la mesa

### 👨‍🍳 Cocina (`/modules/cocina`)
- **PedidosActivos** — tarjetas de órdenes en tiempo real con botón para cambiar estado

---

## 🪝 Hooks principales

| Hook | Descripción |
|---|---|
| `useAuth` | Acceso a usuario, rol y JWT desde el contexto |
| `useToast` | Notificaciones de éxito, error e información |
| `useWebSocket` | Conexión al servidor de WebSockets por rol |
| `useMeseroMesas` | Mesas disponibles y atendidas por el mesero |
| `usePedido` | Estado y lógica del pedido actual |
| `useFetch` | Hook genérico para llamadas a la API |

---

## 🤖 Créditos

| Parte | Autor |
|---|---|
| Integración con API REST | Santiago Vera |
| Lógica de negocio y hooks | Santiago Vera + [Claude] (Anthropic AI) |
| Diseño UI y componentes React | Santiago Vera + [Claude](Anthropic AI) |

> 💡 Los componentes de interfaz fueron desarrollados con asistencia de [Claude](https://claude.ai) (Anthropic AI), con integración a la API realizada manualmente.

---

## 👤 Autor

**Santiago Vera**  
[Portfolio](https://sankiss55.github.io/KISSAN-STUDIO/) · [GitHub](https://github.com/sankiss55)