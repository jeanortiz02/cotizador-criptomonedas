

// Variables 
const criptomonedaSelect = document.querySelector('#criptomonedas');
const formulario = document.querySelector('#formulario');
const monedaSelect = document.querySelector('#moneda');
const resultado = document.querySelector('#resultado');

// Objecto de busqueda 
const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

// Promise 
const obtenerCriptomonedas = criptomonedas => new Promise (resolve => {

    resolve(criptomonedas)
});

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario)
    criptomonedaSelect.addEventListener('change', leerValor)
    monedaSelect.addEventListener('change', leerValor)
})

async function consultarCriptomonedas() {
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

    // fetch(url) 
    //     .then(respuesta => respuesta.json())
    //     .then(resultado => obtenerCriptomonedas(resultado.Data))
    //     .then( criptomonedas => selectCriptomonedas(criptomonedas));

        try {
            const respuesta = await fetch(url);
            const criptomonedas = await respuesta.json();
            const criptomonedasArray = criptomonedas.Data;
            selectCriptomonedas(criptomonedasArray);

        } catch (error) {
            console.log(error);
        }
}

function selectCriptomonedas(criptomonedas) {

    criptomonedas.forEach(cripto => {
        const {FullName, Name} = cripto.CoinInfo;


        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;

        criptomonedaSelect.appendChild(option);
    });
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
    // console.log(objBusqueda);
}


function submitFormulario(e) {
    e.preventDefault();
    

    // Validar 
    const {moneda, criptomoneda} = objBusqueda;

    if (moneda === '' || criptomoneda === '') {
        mostrarAlerta('Ambos campos son obligatorios')
        return;
    }

    // Consultar la API con los resultados
    consultAPI();

    // formulario.reset();
}

function mostrarAlerta(msg) {

    const error = document.querySelector('.error');
    
    if(!error) {
        const divMensaje = document.createElement('div');
        divMensaje.textContent = msg;
        divMensaje.classList.add('error');
    
        formulario.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

}

function consultAPI() {

    const {moneda, criptomoneda} = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    setTimeout(() => {
        
        fetch(url) 
            .then(response => response.json())
            .then (result => {
                mostarConsultaHTML(result.DISPLAY[criptomoneda][moneda]);
            })
    }, 2000);
}

function mostarConsultaHTML(cotizacion) {
    limpiarHTML();
    
    const {CHANGEPCT24HOUR, PRICE, HIGHDAY, LOWDAY, LASTUPDATE } = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El Precio es <span>${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `Precio más alto del día <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `Precio más bajo del día <span>${LOWDAY}</span>`;

    const ultimaHora = document.createElement('p');
    ultimaHora.innerHTML = `Variacion de las ultimas 24 horas <span>${CHANGEPCT24HOUR}%</span>`;
   
   
    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `Actualizado <span>${LASTUPDATE}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimaHora);
    resultado.appendChild(ultimaActualizacion);
}

function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner() {
    limpiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');
    divSpinner.innerHTML = `
    
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    
    `

    resultado.appendChild(divSpinner);
}
