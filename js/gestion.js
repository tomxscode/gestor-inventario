import('./general.js')

// Conexión firebase
const db = firebase.firestore();

// Variables DOM
const
    headShopName = document.querySelector('#headShopName')
    // Tabla de items
    itemsTable = document.querySelector('#itemsTable'),
    addProductForm = document.querySelector('#addProductForm')
    ;

// Variables
let
    id = ''
    ;

// Funciones de items
// primero pasamos los parametros, seguido 'products' es la tabla donde se almacenara, si no existe, la crea.
const addProduct = (code, name, quant, price, sold) =>
    db.collection('products').doc().set({code, name, quant, price, sold});
// obtiene todos los items
const getProducts = () => db.collection('products').get();
// obtiene un producto
const getProduct = (id) => db.collection('products').doc(id).get();
// ongetitems
const onGetProducts = (callback) => db.collection('products').onSnapshot(callback);
const updateProduct = (id, updatedProduct) =>
    db.collection('products').doc(id).update(updatedProduct);
const deleteProduct = id => db.collection('products').doc(id).delete();

window.onload = function() {
    // Asignación de nombre de tienda
    headShopName.innerHTML = shopName;
    document.title = shopName;
}

window.addEventListener('DOMContentLoaded', async (e) => {
    onGetProducts((querySnapshot) => {
        itemsTable.innerHTML = `
            <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Vendidos</th>
                <th>Acciones</th>
            </tr>
        `;
        querySnapshot.forEach(doc => {
            const product = doc.data();
            product.id = doc.id;
            itemsTable.innerHTML += `
            <tr>
                <td>${product.code}</td>
                <td>${product.name}</td>
                <td>${product.quant}</td>
                <td>${product.price}</td>
                <td>${product.sold}</td>
                <td>proximamente</td>
            </tr>`
        })
    })
})

addProductForm.addEventListener('submit', async(e) => {
    const
        code = addProductForm['code'].value,
        name = addProductForm['name'].value,
        quant = addProductForm['quant'].value,
        price = addProductForm['price'].value
        ;
    e.preventDefault();

    await addProduct(code, name, parseInt(quant), parseInt(price), 0);
    addProductForm.reset();
    let modal = document.querySelector('#addProductModal');
    modal.style.display = 'none';
})