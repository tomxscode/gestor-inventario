import('./general.js')

// Variables
const
    headShopName = document.querySelector('#headShopName')
    ;

window.onload = function() {
    // Asignación de nombre de tienda
    headShopName.innerHTML = shopName;
    document.title = shopName;
}