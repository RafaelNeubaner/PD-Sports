# README Functions

Documentação consolidada das funções de acesso à API em:

- `js/products/useProducts.js`
- `js/users/useUsers.js`

---

## Estruturas de objetos

### `Product`

```js
{
	id: string,               // formato: "id.endpoint" (ex: "20.1")
	name: string,
	price: number,
	discount: number,
	discountPercentage: number,
	noDiscount: boolean,
	brand: string,
	description: string,
	characteristics: Object,
	variants: string[],
	images: string[],
	category: string,
	gender: string,
	isProduct2?: boolean
}
```

### `User`

```js
{
	id: string,
	firstname: string,
	lastname: string,
	cpf: string,
	phone: string,
	birthday: Date,
	email: string,
	password: string
}
```

---

## `useProducts.js`

Base URL:

- `https://69c284407518bf8facbe9c12.mockapi.io/api/`

### `createProduct(product, endpoint = "product2")`

- **Parâmetros**:
	- `product: Product`
	- `endpoint: string` (opcional)
- **Retorno**: `Promise<Product>`

### `updateProduct(id, product)`

- **Parâmetros**:
	- `id: string` (formato `id.endpoint`)
	- `product: Product`
- **Retorno**: `Promise<Product>`

### `deleteProduct(id)`

- **Parâmetros**:
	- `id: string` (formato `id.endpoint`)
- **Retorno**: `Promise<Product>`

### `getAllProducts()`

- **Parâmetros**: nenhum
- **Retorno**: `Promise<Product[]>`

### `getProductById(id)`

- **Parâmetros**:
	- `id: string` (formato `id.endpoint`)
- **Retorno**: `Promise<Product>`

### `getProductsByCategory(category)`

- **Parâmetros**:
	- `category: string`
- **Retorno**: `Promise<Product[]>`

### `getProductsFilter(query, category, gender, discount, sortByPrice = false, order = "desc")`

- **Parâmetros**:
	- `query: string`
	- `category: string | null`
	- `gender: string | null`
	- `discount: boolean`
	- `sortByPrice: boolean` (opcional)
	- `order: 'asc' | 'desc'` (opcional, padrão: `"desc"`)
- **Retorno**: `Promise<Product[]>`

---

## `useUsers.js`

Base URL:

- `https://69d3b21c336103955f8f770c.mockapi.io/api/`

### `createUser(user)`

- **Parâmetros**:
	- `user: User`
- **Retorno**: `Promise<User>`

### `updateUser(id, user)`

- **Parâmetros**:
	- `id: string`
	- `user: User`
- **Retorno**: `Promise<User>`

### `deleteUser(id)`

- **Parâmetros**:
	- `id: string`
- **Retorno**: `Promise<User>`

### `getUserById(id)`

- **Parâmetros**:
	- `id: string`
- **Retorno**: `Promise<User>`

### `getUserByEmail(email)`

- **Parâmetros**:
	- `email: string`
- **Retorno**: `Promise<User[]>`

---

## Exemplos de uso com `await`

### Exemplo base de import

```js
import {
	createProduct,
	updateProduct,
	deleteProduct,
	getAllProducts,
	getProductById,
	getProductsByCategory,
	getProductsFilter
} from "/js/products/useProducts.js";

import {
	createUser,
	updateUser,
	deleteUser,
	getUserById,
	getUserByEmail
} from "/js/users/useUsers.js";
```

### `useProducts.js` com `await`

```js
// CREATE
const novoProduto = await createProduct({
	name: "Bola Teste",
	price: 100,
	discount: 90,
	discountPercentage: 10,
	noDiscount: false,
	brand: "Marca X",
	description: "Produto de teste",
	characteristics: {},
	variants: [],
	images: [],
	category: "Futebol",
	gender: "Unisex",
	isProduct2: true
}, "product2");

// UPDATE (id no formato id.endpoint)
const produtoAtualizado = await updateProduct("20.1", {
	...novoProduto,
	price: 120,
	discount: 99,
	discountPercentage: 17.5
});

// DELETE
const produtoRemovido = await deleteProduct("20.2");

// GET ALL
const todosProdutos = await getAllProducts();

// GET BY ID
const produto = await getProductById("15.1");

// GET BY CATEGORY
const produtosFutebol = await getProductsByCategory("Futebol");

// GET FILTER
const filtrados = await getProductsFilter(
	"Bermuda",   // query
	"Tênis",     // category
	"Masculino", // gender
	true,         // discount (somente com desconto)
	true,         // sortByPrice
	"asc"        // order
);
```

### `useUsers.js` com `await`

```js
// CREATE
const novoUsuario = await createUser({
	firstname: "Pedro",
	lastname: "Silva",
	cpf: "00000000000",
	phone: "11999999999",
	birthday: new Date("2000-01-01"),
	email: "pedro@email.com",
	password: "senha123"
});

// UPDATE
const usuarioAtualizado = await updateUser(novoUsuario.id, {
	...novoUsuario,
	phone: "11988888888"
});

// GET BY ID
const usuarioPorId = await getUserById(novoUsuario.id);

// GET BY EMAIL
const usuariosPorEmail = await getUserByEmail("pedro@email.com");

// DELETE
const usuarioRemovido = await deleteUser(novoUsuario.id);
```
