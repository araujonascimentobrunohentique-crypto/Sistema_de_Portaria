// public/js/alert.js
document.addEventListener("DOMContentLoaded", () => {
// Seleciona todos os alertas
const alerts = document.querySelectorAll('.alert');
// Para cada alerta
alerts.forEach(alert => {
 
    setTimeout(() => {
        alert.classList.remove('show');
        alert.classList.add('fade');

        setTimeout(() => {
            alert.remove();
        }, 500);
    }, 3000);
});
});