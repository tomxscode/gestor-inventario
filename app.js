const db = firebase.firestore();
const addItemBtn = document.querySelector('#addItem');

const dataForm = document.querySelector('#addDataForm');
const itemsTable = document.querySelector('#itemsTable');

// modal
const modal = document.querySelector('#editModal');
const addItemModal = document.querySelector("#addItemModal");
const closeModal = document.querySelector('#closeModal');
const closeAddModal = document.querySelector('#closeAddModal');
const editForm = document.querySelector('#editForm');
const alertsContainer = document.querySelector('#alertsContainer');
const addItemModalBtn = document.querySelector('#addItemBtn');

// funciones items
const addItem = (item, barcode, cost, price, quant) =>
  db.collection('items').doc().set({ item, barcode, cost, price, quant });
const updateItem = (id, updateItem) =>
  db.collection('items').doc(id).update(updateItem);
const getItems = () => db.collection('items').get();
const getItem = (id) => db.collection('items').doc(id).get();
const onGetItems = (callback) => db.collection('items').onSnapshot(callback);
const deleteItem = id => db.collection('items').doc(id).delete();

// variables
let permitedAdd = true; // TODO: cambiar este sistema
let id = '';
let permitedList = [false, false, false, false, false];

// comprobaciones
dataForm['itemName'].addEventListener('keyup', () => {
  if (dataForm['itemName'].value != '') {
    permitedList[0] = true;
  } else {
    permitedList[0] = false;
  }
});

dataForm['itemBarcode'].addEventListener('keyup', () => {
  if (dataForm['itemBarcode'].value != '') {
    permitedList[1] = true;
  } else {
    permitedList[1] = false;
  }
});

dataForm['itemCost'].addEventListener('keyup', () => {
  if (dataForm['itemCost'].value > 0) {
    permitedList[2] = true;
  } else {
    permitedList[2] = false;
  }
});

dataForm['itemPrice'].addEventListener('keyup', () => {
  if (dataForm['itemPrice'].value > 0) {
    permitedList[3] = true;
  } else {
    permitedList[3] = false;
  }
});

addItemModalBtn.addEventListener('click', () => {
  addItemModal.style.display = 'block';
})

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

closeAddModal.addEventListener('click', () => {
  addItemModal.style.display = 'none';
})

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}

function createAlert(alertText, secondClass) {
  alertsContainer.innerHTML += `
  <div class="alert ${secondClass}">
    <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
    ${alertText}
  </div>`;
  return false;
}

window.addEventListener('DOMContentLoaded', async (e) => {
  onGetItems((querySnapshot) => {
    itemsTable.innerHTML = `
        <tr>
            <th>Cod. de barras</th>
            <th>Nombre</th>
            <th>Costo</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Acciones</th>
        </tr>`;
    querySnapshot.forEach(doc => { //test
      const item = doc.data();
      item.id = doc.id;
      itemsTable.innerHTML += `
            <tr>
                <td class="barcode">${item.barcode}</td>
                <td>${item.item}</td>
                <td>${item.cost}</td>
                <td>${item.price}</td>
                <td>${item.quant}</td>
                <td>
                  <button class="btn btn-secondary btn-edit" data-id="${item.id}">Editar</button>
                  <button class="btn btn-danger btn-delete" data-id="${item.id}">Eliminar</button>
                </td>
            </tr>`;

      const btnsDelete = document.querySelectorAll('.btn-delete');
      btnsDelete.forEach(btn => {
        btn.addEventListener('click', async(e) => {
          await deleteItem(e.target.dataset.id);
          createAlert(`Un item ha sido eliminado`, 'deleted');
        })
      })
      const btnsEdit = document.querySelectorAll('.btn-edit');
      btnsEdit.forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const doc = await getItem(e.target.dataset.id);
          id = e.target.dataset.id;

          editForm['itemName'].value = doc.data().item;
          editForm['itemBarcode'].value = doc.data().barcode;
          editForm['itemCost'].value = doc.data().cost;
          editForm['itemPrice'].value = doc.data().price;
          //editForm['itemQuant'].value = doc.data().quant;

          modal.style.display = 'block';

          editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newItemName = editForm['itemName'].value;
            const newItemBarcode = editForm['itemBarcode'].value;
            const newItemCost = editForm['itemCost'].value;
            const newItemPrice = editForm['itemPrice'].value;
            const newItemQuant = editForm['itemQuant'].value;
            await updateItem(id, {
              barcode: newItemBarcode,
              item: newItemName,
              cost: newItemCost,
              price: newItemPrice,
              quant: newItemQuant
            }); // un comentario
            modal.style.display = 'none';
            createAlert(`Un item ha sido editado`, 'edited');
          })
        })
      })


    });
  });
});


dataForm.addEventListener('submit', async (e) => {
  const itemName = dataForm['itemName'].value;
  const itemBarcode = dataForm['itemBarcode'].value;
  const itemCost = dataForm['itemCost'].value;
  const itemPrice = dataForm['itemPrice'].value;
  const itemQuant = dataForm['itemQuant'].value;
  e.preventDefault();
  if (permitedAdd) {
    await addItem(itemName, itemBarcode, itemCost, itemPrice, itemQuant);
    dataForm.reset();
    addItemModal.style.display = 'none';
    createAlert('Un item ha sido creado', 'edited');
  } else {
    createAlert('Hay datos inválidos, vuelva a intentarlo', 'deleted');
  }
});