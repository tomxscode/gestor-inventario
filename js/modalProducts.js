// variables
let
    btn = document.querySelector('#addProductBtn'),
    modal = document.querySelector('#addProductModal'),
    close = document.querySelector('#closeModal')
    ;

btn.addEventListener('click', function() {
    modal.style.display = 'block';
})

close.addEventListener('click', function() {
    modal.style.display = 'none';
})