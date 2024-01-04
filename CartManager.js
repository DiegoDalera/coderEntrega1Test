const fs = require('fs').promises;

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = this.loadCarts() || [];
        this.nextCartId = 1;
    }

    async loadCarts() {
        try {
            if (await fs.stat(this.path)) {
                const data = await fs.readFile(this.path, 'utf8');
                console.log("Data del archivo de carritos:", data);
                this.carts = JSON.parse(data);
                this.nextCartId = this.carts.length > 0 ? Math.max(...this.carts.map(c => c.id)) + 1 : 1;
            }
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.log("El archivo de carritos no existe. Se iniciará un nuevo arreglo de carritos.");
                this.carts = [];
            } else {
                throw err;
            }
        }
    }

    async saveCarts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2), 'utf8');
        } catch (err) {
            console.error("Error al guardar los carritos:", err);
        }
    }

    async createCart() {
        const cart = {
            id: this.nextCartId++,
            products: [],
        };

        this.carts.push(cart);
        await this.saveCarts();
        console.log(`Carrito creado con ID ${cart.id}`);
        return cart;
    }

    async getCartById(cartId) {
        const cart = this.carts.find(cart => cart.id === cartId);
        if (cart) {
            return cart;
        } else {
            return { error: 'Carrito no encontrado' };
        }
    }

    async addToCart(cartId, productId, quantity) {
        const cart = await this.getCartById(cartId);
        if (cart.error) {
            return cart;
        }

        const productInCart = cart.products.find(product => product.id === productId);

        if (productInCart) {
            productInCart.quantity += quantity;
        } else {
            cart.products.push({ id: productId, quantity });
        }

        await this.saveCarts();
        console.log(`Producto agregado al carrito con ID ${cartId}`);
        return cart;
    }
}

module.exports = CartManager;
