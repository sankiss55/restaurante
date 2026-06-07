# Frontend - RestoAdmin

Sistema de administración de restaurantes construido con React, TypeScript y Tailwind CSS.

## 🏗️ Arquitectura

### Estructura de Carpetas

```
src/
├── components/          # Componentes reutilizables
│   ├── common/         # Componentes comunes (Tabla, Botón, etc.)
│   ├── Sidebar.tsx     # Navegación lateral
│   └── MesasPanel.tsx  # Panel de mesas
├── context/            # React Context (Auth)
├── hooks/              # Custom hooks
├── layouts/            # Layouts reutilizables
├── modules/            # Módulos específicos por rol
│   ├── admin/          # Administración (Categorías, Productos, Usuarios)
│   ├── mesero/         # Mesero (Nuevo Pedido)
│   └── cocina/         # Cocina (Pedidos Activos)
├── pages/              # Páginas principales
├── services/           # Servicios (API)
└── App.tsx             # Componente raíz
```

## 🎨 Componentes Reutilizables

### Componentes Comunes (`/components/common`)

#### 1. **Tabla**
```tsx
import Tabla from './components/common/Tabla';

const columnas = [
  { key: 'nombre', etiqueta: 'Nombre', ancho: '1fr' },
  { key: 'precio', etiqueta: 'Precio', ancho: '100px', alineacion: 'center' }
];

<Tabla 
  columnas={columnas} 
  datos={datos}
  acciones={{ editar: (id) => {}, eliminar: (id) => {} }}
/>
```

#### 2. **Boton**
```tsx
import Boton from './components/common/Boton';

<Boton 
  texto="Guardar"
  variante="primario"    // primario | secundario | peligro | neutral
  tamaño="mediano"       // pequeño | mediano | grande
  icono={<Icon />}
  cargando={false}
  deshabilitado={false}
  onClick={() => {}}
/>
```

#### 3. **InputBusqueda**
```tsx
import InputBusqueda from './components/common/InputBusqueda';

<InputBusqueda 
  placeholder="Buscar..."
  valor={busqueda}
  onChange={setBusqueda}
  icono={true}
/>
```

#### 4. **TarjetaEstadistica**
```tsx
import TarjetaEstadistica from './components/common/TarjetaEstadistica';

<TarjetaEstadistica
  etiqueta="Total Categorías"
  valor="24"
  variante="default"  // default | destacado
  icono={<Icon />}
  descripcion="Opcional"
/>
```

#### 5. **Paginacion**
```tsx
import Paginacion from './components/common/Paginacion';

<Paginacion 
  paginaActual={1}
  totalPaginas={5}
  totalItems={50}
  itemsPorPagina={10}
  onCambiarPagina={(pagina) => {}}
/>
```

#### 6. **Modal**
```tsx
import Modal from './components/common/Modal';

<Modal
  isOpen={open}
  titulo="Confirmar eliminación"
  descripcion="¿Estás seguro?"
  confirmText="Eliminar"
  cancelText="Cancelar"
  variant="peligro"  // default | peligro
  onConfirm={() => {}}
  onCancel={() => {}}
>
  {/* Contenido opcional */}
</Modal>
```

#### 7. **InputForm**
```tsx
import InputForm from './components/common/InputForm';

<InputForm
  label="Nombre"
  name="nombre"
  type="text"
  value={valor}
  onChange={(e) => setValor(e.target.value)}
  error={error}
  required={true}
  multiline={false}
/>
```

#### 8. **SelectForm**
```tsx
import SelectForm from './components/common/SelectForm';

<SelectForm
  label="Categoría"
  name="categoria"
  options={[
    { value: '1', label: 'Comida' },
    { value: '2', label: 'Bebidas' }
  ]}
  value={categoria}
  onChange={(e) => setCategoria(e.target.value)}
  required={true}
/>
```

#### 9. **Cargador**
```tsx
import Cargador from './components/common/Cargador';

<Cargador tamaño="mediano" texto="Cargando..." />
```

#### 10. **Alerta**
```tsx
import Alerta from './components/common/Alerta';

<Alerta
  titulo="Operación exitosa"
  mensaje="El registro fue guardado"
  variante="exito"  // exito | error | advertencia | informacion
  autoCerrar={3000}
/>
```

## 🪝 Custom Hooks

### useFetch
```tsx
import useFetch from './hooks/useFetch';

const { datos, cargando, error, refetch } = useFetch<Categoria[]>('/api/categorias');

if (cargando) return <Cargador />;
if (error) return <Alerta titulo="Error" variante="error" />;

return <Tabla datos={datos || []} />;
```

### usePaginacion
```tsx
import usePaginacion from './hooks/usePaginacion';

const { paginaActual, irAPagina, proximaPagina, paginaAnterior } = usePaginacion();

const datosVisibles = datos.slice(
  (paginaActual - 1) * 10,
  paginaActual * 10
);
```

### useFiltros
```tsx
import useFiltros from './hooks/useFiltros';

const { filtros, actualizarFiltro, limpiarFiltros, aplicarFiltro } = useFiltros({
  categoria: '',
  estado: 'activo'
});

actualizarFiltro('categoria', 'comida');
```

## 🔐 Autenticación

Sistema de autenticación basado en JWT con React Context:

```tsx
import { useAuth } from './context/AuthContext';

const { isAuthenticated, loading, login, logout } = useAuth();

// Login
await login('email@example.com', 'password');

// Logout
logout();
```

## 🛣️ Rutas

| Ruta | Descripción |
|------|-------------|
| `/login` | Página de login |
| `/dashboard` | Dashboard principal (Mesas) |
| `/dashboard/categorias` | Gestión de categorías |
| `/dashboard/productos` | Inventario de productos |
| `/dashboard/usuarios` | Control de usuarios |
| `/dashboard/nuevo-pedido` | Crear nuevo pedido |
| `/dashboard/pedidos-activos` | Cocina - Órdenes activas |

## 🎨 Colores del Sistema

```css
Primary: #4F6A50   /* Verde oscuro */
Secondary: #E9EFE9 /* Verde claro */
Dark Text: #2C3322
Light Text: #6B7264
White: #FFFFFF
```

## 🚀 Configuración

### Variables de Entorno

```
VITE_API_URL=https://your-api-url.com
```

### Dependencias Principales

- React 19.2.6
- TypeScript 6.0.2
- Tailwind CSS 4.3.0
- React Router DOM 7.15.1
- Axios 1.16.1
- js-cookie 3.0.7

## 📦 Patrón de Componentes

### Estructura de Props Interface
```tsx
interface MiComponenteProps {
  prop1: string;
  prop2?: number;
  onClick?: () => void;
}

const MiComponente: React.FC<MiComponenteProps> = ({ prop1, prop2, onClick }) => {
  return <div>{prop1}</div>;
};
```

### Manejo de Estados
```tsx
const [estado, setEstado] = useState<Tipo>(valorInicial);
```

### Estilos con Tailwind
- No usar CSS custom, solo clases de Tailwind
- Colores del sistema usando valores hexadecimales
- Breakpoints: sm (640px), md (768px), lg (1024px)

## 🔄 Flujo de Datos

1. **Componentes reutilizables** consumen props y emiten eventos
2. **Hooks** manejan lógica compleja (fetch, paginación, filtros)
3. **Context** maneja estado global (autenticación)
4. **Services** comunican con la API

## ✨ Mejores Prácticas

1. **Componentes pequeños y específicos** - Máximo responsabilidad única
2. **Props interfaces** - Siempre definir tipos para props
3. **Nombres en español** - Mantener consistencia en la nomenclatura
4. **Reutilización** - Usar componentes comunes antes de crear nuevos
5. **TypeScript** - Aprovecha el tipo fuerte en todo el proyecto
6. **Tailwind** - No usar CSS custom, mantener limpieza visual

## 🧪 Contribución

Al agregar nuevos componentes:
1. Crear en carpeta `/common` si es reutilizable
2. Definir props interface
3. Documentar en este README
4. Usar nomenclatura consistente (español + camelCase)

---

**Última actualización**: 2024
