(() => {  // IIFE
    "use strict";
    const letras = "abcdefghijklmnñopqrstuvwxyz";
    let listaLetras = [];
    let canvas = document.createElement('canvas');
    let puntos = 0;

    class Letra {
        constructor(canvas) {
            this.canvas = canvas;
            let maxX = canvas.width - 100;
            let maxY = canvas.height - 100;
            this.posicion = { x: Math.random() * maxX + 50, y: Math.random() * maxY + 50 };
            this.letra = Array.from(letras)[Math.floor(Math.random() * letras.length)];
           // console.log(this.posicion, this.letra);
            this.color = 'rgba(0, 0, 0, 1)';
           
        }
        dibujar(){
            let ctx = this.canvas.getContext('2d');
            ctx.fillStyle = this.color;
            let circle = new Path2D();
            circle.arc(this.posicion.x, this.posicion.y, 25, 0, 2 * Math.PI);
            ctx.fill(circle);
            ctx.font = '24px mono';
            ctx.fillStyle = 'rgba(255,255,255,1)';
            ctx.fillText(this.letra,this.posicion.x-8,this.posicion.y+8);
        }
    }

    function dibujarLetras(){
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

                 
                 listaLetras.map(l => l.color = 'rgba(0, 0, 0, 1)' ); // reset del color
                 listaLetras.map(l => { //buscar si tiene cercanas
                     let cercanas = listaLetras.filter(ll => {
                         let distancia = Math.sqrt(Math.pow(ll.posicion.x - l.posicion.x, 2) + Math.pow(ll.posicion.y - l.posicion.y, 2));
                         if (distancia < 50) {return true;} else {return false;}
                     });
                     if (cercanas.length > 1) {l.color =  'rgba(0, 0, 0, 0.5)';}
                 });
                 
                 listaLetras.map(l => l.dibujar());
    }

    function iniciar(){
        let divPartida = document.querySelector('#partida');
        canvas.classList.add('canvas');
        canvas.width = 900;
        canvas.height = 500;
        divPartida.append(canvas);

        listaLetras = [];
        puntos = 0;
        let spanLetras = document.querySelector('#letras');
         // Dibuixar i crear lletres
         let fin = false;
         let intervalo = 2000;
         async function esperar(ms) { return new Promise(r => setTimeout(r, ms)) }
         (async () => {
             while (!fin) {
                 await esperar(intervalo);
                 intervalo = intervalo - (intervalo * 0.05);
                 let letra = new Letra(canvas);
                 listaLetras.push(letra);
                 spanLetras.innerHTML = listaLetras.length;
                 if(listaLetras.length >= 15){
                     fin = true;
                     mostrarPuntuacion(puntos);
                 }
                 dibujarLetras(canvas);
             }
         })();
    }

    function mostrarPuntuacion(puntos){
        let dialogo = document.createElement('div');
        dialogo.id='dialogo';
        dialogo.innerHTML=`<span>La partida ha acabado!</br>Puntuación: ${puntos}</span>`; 
        document.querySelector('body').append(dialogo);
        let botonOk = document.createElement('button');
        botonOk.innerText = 'Ok';
        dialogo.append(botonOk);
        botonOk.addEventListener('click',()=>{
            iniciar();
            dialogo.remove();
        });
    }



    // Esperar a que carregue el DOM 
    document.addEventListener("DOMContentLoaded", function () {

        iniciar();

        // detectar polsacions
        let spanPuntos = document.querySelector('#puntos');
       
        document.addEventListener('keypress',function(event){
            console.log(event.key);
            puntos = puntos + listaLetras.filter(l=> l.letra == event.key).length * 100;
            spanPuntos.innerHTML = puntos;
            listaLetras =  listaLetras.filter(l=>l.letra != event.key);   
            dibujarLetras();         
        })


    });

})();