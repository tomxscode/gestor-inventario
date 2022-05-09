import('./general.js')

// Conexión firebase
const db = firebase.firestore();

// Variables DOM
const
    headShopName = document.querySelector('#headShopName')
    // Tabla de items
    itemsTable = document.querySelector('#itemsTable'),
    addProductForm = document.querySelector('#addProductForm'),
    closeModal2 = document.querySelector('#closeModal2'),
    modal2 = document.querySelector('.modal2')
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
const updateProduct = (id, updateItem) =>
    db.collection('products').doc(id).update(updateItem);
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
                <td>$${product.price}</td>
                <td>${product.sold}</td>
                <td class="tableActions">
                    <button class="minibtn tooltip info" data-id="${product.id}">
                    <span class="material-symbols-outlined">
                    info
                    </span>
                    </button>
                    <button class="minibtn tooltip edit" data-id="${product.id}">
                    <span class="material-symbols-outlined">
                    edit
                    </span>
                    </button>
                    <button class="minibtn tooltip delete" data-id="${product.id}">
                    <span class="material-symbols-outlined">
                    delete
                    </span>
                    </button>
                </td>
            </tr>`
            const btnsDelete = document.querySelectorAll('.delete');
            btnsDelete.forEach(btn => {
                btn.addEventListener('click', async(e) => {
                    await deleteProduct(e.target.dataset.id);
                    console.log('borrado')
                })
            })
            const btnsRemove = document.querySelectorAll('.remove');
            btnsRemove.forEach(btn => {
                btn.addEventListener('click', async(e) => {
                    id = e.target.dataset.id;
                    updateProduct(id, {
                        code: "hola",
                        name: "buen dia",
                        quant: 1,
                        sold: 1
                    })
                })
            })
            const btnsInfo = document.querySelectorAll('.info');
            btnsInfo.forEach(btn => {
                btn.addEventListener('click', async(e) => {
                    modal2.style.display = 'block';
                    //const doc = await getProduct(e.target.dataset.id);
                    id = e.target.dataset.id; 
                    // Variables
                    let 
                        infoTitle = document.querySelector('#infoTitle'),
                        productCode = document.querySelector('#productCode'),
                        productQuant = document.querySelector('#productQuant'),
                        productPrice = document.querySelector('#productPrice'),
                        productSold = document.querySelector('#productSold'),
                        // información
                        productTotalSold = document.querySelector('#productTotalSold')
                        ;

                    const task = await getProduct(e.target.dataset.id)

                    let
                        pName = task.data().name,
                        pCode = task.data().code,
                        pQuant = parseInt(task.data().quant),
                        pPrice = parseInt(task.data().price),
                        pSold = parseInt(task.data().sold)
                    ;

                    infoTitle.innerHTML = pName;
                    productCode.innerHTML = pCode;
                    productQuant.innerHTML = pQuant;
                    productPrice.innerHTML = `$${pPrice}`;
                    productSold.innerHTML = pSold;

                    // sector de información
                    let iTotalSold = pSold * pPrice;
                    productTotalSold.innerHTML = `$${iTotalSold}`
                })
            })
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

closeModal2.addEventListener('click', function() {
    modal2.style.display = "none";
})