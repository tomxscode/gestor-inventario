import('./general.js')

// Conexión firebase
const db = firebase.firestore();

// Variables DOM
const
    headShopName = document.querySelector('#headShopName')
    // Tabla de items
    itemsTable = document.querySelector('#itemsTable')
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

window.onload = function() {
    // Asignación de nombre de tienda
    headShopName.innerHTML = shopName;
    document.title = shopName;
}

window.addEventListener('DOMContentLoaded', async (e) => {
    onGetProducts((querySnapshot) => {
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

console.log('hola')