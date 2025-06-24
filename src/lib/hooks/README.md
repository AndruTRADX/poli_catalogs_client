# Hooks de React para API de Catálogo

Esta carpeta contiene todos los hooks personalizados para interactuar con la API de Python del catálogo de productos.

## Configuración

El agente de API está configurado para conectarse a `http://localhost:8000`. Asegúrate de que tu servidor de Python esté ejecutándose en esa dirección.

## Hooks Disponibles

### 🔐 useAuth
Hook para manejar la autenticación de usuarios.

```typescript
import { useAuth } from '../lib/hooks/useAuth';

const { 
  user, 
  isLoading, 
  login, 
  register, 
  logout, 
  isAdmin 
} = useAuth();
```

**Funcionalidades:**
- Login y registro de usuarios
- Gestión del estado de autenticación
- Verificación de roles (admin/user)
- Logout automático

### 📦 useArticles
Hook para manejar operaciones CRUD de artículos.

```typescript
import { useArticles } from '../lib/hooks/useArticles';

const { 
  articles, 
  article, 
  createArticle, 
  updateArticle, 
  deleteArticle,
  searchArticles,
  advancedSearch 
} = useArticles(articleId); // articleId es opcional
```

**Funcionalidades:**
- Obtener todos los artículos
- Obtener un artículo específico
- Crear, actualizar y eliminar artículos
- Búsqueda simple y avanzada
- Crear múltiples artículos

### 🛒 useCart
Hook para manejar el carrito de compras.

```typescript
import { useCart } from '../lib/hooks/useCart';

const { 
  cart, 
  addToCart, 
  removeFromCart, 
  clearCart, 
  purchaseCart 
} = useCart();
```

**Funcionalidades:**
- Ver contenido del carrito
- Agregar artículos al carrito
- Remover artículos del carrito
- Vaciar carrito completo
- Realizar compra

### 🔍 useSearch
Hook para búsquedas de artículos.

```typescript
import { useSearch } from '../lib/hooks/useSearch';

const { searchArticles, advancedSearch } = useSearch();
```

**Funcionalidades:**
- Búsqueda simple por nombre
- Búsqueda avanzada con filtros múltiples

### 📂 useCategories
Hook para manejar categorías de productos.

```typescript
import { useCategories } from '../lib/hooks/useCategories';

const { categories, categoryStats, getArticlesByCategory } = useCategories(articles);
```

**Funcionalidades:**
- Lista de categorías disponibles
- Estadísticas por categoría
- Filtrar artículos por categoría

### 👥 useUsers
Hook preparado para futuras funcionalidades de gestión de usuarios.

```typescript
import { useUsers } from '../lib/hooks/useUsers';

const { getCurrentUser } = useUsers();
```

## Tipos Disponibles

### Artículos
```typescript
interface Article {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}
```

### Carrito
```typescript
interface CartItem {
  article_id: string;
  quantity: number;
}

interface CartResponse {
  items: CartItemResponse[];
  total_price: number;
  cart_id?: string;
}
```

### Búsqueda
```typescript
interface AdvancedSearch {
  name?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
}
```

## Ejemplos de Uso

### Agregar artículo al carrito
```typescript
const { addToCart } = useCart();

const handleAddToCart = (articleId: string) => {
  addToCart.mutate({
    article_id: articleId,
    quantity: 1
  });
};
```

### Búsqueda avanzada
```typescript
const { advancedSearch } = useSearch();

const handleSearch = async () => {
  const result = await advancedSearch.mutateAsync({
    category: "Electrónica",
    min_price: 100,
    max_price: 1000
  });
  console.log(result.articulos);
};
```

### Crear múltiples artículos
```typescript
const { createMultipleArticles } = useArticles();

const handleBulkCreate = async () => {
  const articles = [
    { name: "Artículo 1", category: "Electrónica", description: "...", price: 100, stock: 10 },
    { name: "Artículo 2", category: "Ropa", description: "...", price: 50, stock: 20 }
  ];
  
  await createMultipleArticles.mutateAsync(articles);
};
```

## Manejo de Errores

Todos los hooks utilizan React Query para el manejo de estado y errores. Puedes acceder a los errores así:

```typescript
const { createArticle } = useArticles();

if (createArticle.error) {
  console.error('Error al crear artículo:', createArticle.error);
}
```

## Estados de Carga

Todos los hooks proporcionan estados de carga:

```typescript
const { createArticle } = useArticles();

if (createArticle.isPending) {
  return <div>Guardando...</div>;
}
```

## Invalidación de Cache

Los hooks automáticamente invalidan el cache cuando es necesario. Por ejemplo, después de crear un artículo, se actualiza la lista de artículos automáticamente.

## Componentes de Ejemplo

Revisa los archivos `CartExample.tsx` y `SearchExample.tsx` para ver ejemplos completos de implementación. 