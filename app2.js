document.addEventListener("DOMContentLoaded", function () {
  // Obtener referencias a los elementos del formulario y la lista de pagos
  const paymentForm = document.getElementById("payment-form");
  const paymentsList = document.getElementById("payments-list");

  // Escuchar el evento de envío del formulario
  paymentForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar el envío del formulario

    // Obtener los valores ingresados por el usuario
    const name = document.getElementById("name").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const date = document.getElementById("date").value;

    // Validar que los campos no estén vacíos
    if (name.trim() === "" || isNaN(amount) || date.trim() === "") {
      alert("Por favor, completa todos los campos.");
      return;
    }

    // Crear un nuevo elemento de pago
    const paymentEntry = document.createElement("div");
    paymentEntry.classList.add("payment-entry");
    paymentEntry.innerHTML = `
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Cantidad:</strong> $${amount.toFixed(2)}</p>
      <p><strong>Fecha:</strong> ${date}</p>
      <button class="delete-payment">X</button>
    `;

    // Agregar el elemento de pago a la lista
    paymentsList.appendChild(paymentEntry);

    // Limpiar los campos del formulario después de agregar el pago
    paymentForm.reset();

    // Guardar el pago en el almacenamiento local
    const paymentData = {
      name,
      amount,
      date,
    };
    savePayment(paymentData);

    // Actualizar la URL con los pagos como parámetros de búsqueda
    updateURLWithPayments();
  });

  // Escuchar el evento click para eliminar un pago
  paymentsList.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-payment")) {
      const paymentEntry = event.target.parentElement;
      const name = paymentEntry.querySelector("p strong").textContent;
      const amount = parseFloat(
        paymentEntry.querySelector("p:nth-of-type(2) strong").textContent.slice(1)
      );
      const date = paymentEntry.querySelector("p:nth-of-type(3) strong").textContent;
      
      // Eliminar el pago de la lista en pantalla
      paymentEntry.remove();

      // Eliminar el pago del almacenamiento local
      const paymentData = {
        name,
        amount,
        date,
      };
      deletePayment(paymentData);

      // Actualizar la URL con los pagos restantes como parámetros de búsqueda
      updateURLWithPayments();
    }
  });

  // Función para guardar el pago en el almacenamiento local
  function savePayment(paymentData) {
    let payments = localStorage.getItem("payments");

    // Si no hay pagos almacenados, crear un nuevo array para almacenarlos
    if (!payments) {
      payments = [];
    } else {
      // Si ya hay pagos almacenados, parsear los datos para trabajar con un array
      payments = JSON.parse(payments);
    }

    // Agregar el nuevo pago al array
    payments.push(paymentData);

    // Guardar el array de pagos en el almacenamiento local
    localStorage.setItem("payments", JSON.stringify(payments));
  }

  // Función para eliminar un pago del almacenamiento local
  function deletePayment(paymentData) {
    let payments = localStorage.getItem("payments");

    if (payments) {
      payments = JSON.parse(payments);
      // Filtrar los pagos, excluyendo aquel que coincida con el pago a eliminar
      payments = payments.filter(
        (payment) =>
          payment.name !== paymentData.name ||
          payment.amount !== paymentData.amount ||
          payment.date !== paymentData.date
      );
      // Guardar los pagos restantes en el almacenamiento local
      localStorage.setItem("payments", JSON.stringify(payments));
    }
  }

  // Función para cargar los pagos desde el almacenamiento local
  function loadPayments() {
    let payments = localStorage.getItem("payments");

    // Si hay pagos almacenados, mostrarlos en pantalla
    if (payments) {
      payments = JSON.parse(payments);
      payments.forEach(function (paymentData) {
        const paymentEntry = document.createElement("div");
        paymentEntry.classList.add("payment-entry");
        paymentEntry.innerHTML = `
          <p><strong>Nombre:</strong> ${paymentData.name}</p>
          <p><strong>Cantidad:</strong> $${paymentData.amount.toFixed(2)}</p>
          <p><strong>Fecha:</strong> ${paymentData.date}</p>
          <button class="delete-payment">X</button>
        `;
        paymentsList.appendChild(paymentEntry);
      });
    }
  }

  // Cargar los pagos al cargar la página
  loadPayments();

  // Función para actualizar la URL con los pagos como parámetros de búsqueda
  function updateURLWithPayments() {
    let payments = localStorage.getItem("payments");

    // Si hay pagos almacenados, actualizar la URL con los parámetros de búsqueda
    if (payments) {
      payments = JSON.parse(payments);
      const params = new URLSearchParams();
      payments.forEach(function (paymentData) {
        params.append("name", paymentData.name);
        params.append("amount", paymentData.amount);
        params.append("date", paymentData.date);
      });
      const url = new URL(window.location);
      url.search = params.toString();
      history.replaceState(null, "", url.toString());
    }
  }
});
