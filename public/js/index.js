window.onload = () => {
    init()
}

let currentPosition = null
let selectedSeats = []

const SeatList = [
    { number:"1", row:"1", position:[-8, -8.3, 3]},
    { number:"2", row:"1", position:[-5.5, -8.3, 3]},
    { number:"3", row:"1", position:[-3, -8.3, 3]},
    { number:"4", row:"1", position:[3, -8.3, 3]},
    { number:"5", row:"1", position:[5.5, -8.3, 3]},
    { number:"6", row:"1", position:[8, -8.3, 3]},

    { number:"1", row:"2", position:[-8, -7.8, 7]},
    { number:"2", row:"2", position:[-5.5, -7.8, 7]},
    { number:"3", row:"2", position:[-3, -7.8, 7]},
    { number:"4", row:"2", position:[3, -7.8, 7]},
    { number:"5", row:"2", position:[5.5, -7.8, 7]},
    { number:"6", row:"2", position:[8, -7.8, 7]},

    { number:"1", row:"3", position:[-8, -7.4, 9.8]},
    { number:"2", row:"3", position:[-5.5, -7.4, 9.8]},
    { number:"3", row:"3", position:[-3, -7.4, 9.8]},
    { number:"4", row:"3", position:[3, -7.4, 9.8]},
    { number:"5", row:"3", position:[5.5, -7.4, 9.8]},
    { number:"6", row:"3", position:[8, -7.4, 9.8]}         
]

const positionCamera = [-5.5,-5.5,-5.2,-5.2,-4.9,-4.9]
const ticketPrice = 7
const coin = '€'

function init(){
    initPosition = SeatList.length - 1
    currentPosition = initPosition
    createIconsChairs()
    refreshMessageActualPosition()
    createChairs()
}
function finishLoading(){
    document.querySelector('.loading-screen').style.display = 'none';
}
function createChairs() {
    const loadChair = (seat) => {
        return new Promise((resolve) => {
            const chair = document.createElement('a-entity');
            chair.setAttribute('chair', '');
            chair.setAttribute('gltf-model', 'src: url(public/model/seat.glb);');
            chair.setAttribute('position', seat.position.join(' '));
            chair.addEventListener('model-loaded', () => {
                resolve();
            });
            document.querySelector('#scene').appendChild(chair);
        });
    };

    const loadAllChairs = async () => {
        for (let i = 0; i < SeatList.length; i++) {
            await loadChair(SeatList[i]);
        }
        finishLoading();
        getLoadChairs(SeatList.length);
    };

    loadAllChairs();
}
function createIconsChairs(){
    let addedChairs = 0
    for (let row = 0; row < SeatList.length / 3; row++) {
        const section = document.createElement('div');
        section.className = 'seats-wrapper__row'
        for (let index = 0; index < 3; index++) {
            section.insertAdjacentHTML('afterbegin',
            `
            <div class="${addedChairs === SeatList.length - 1 ? 'seat sit' : 'seat'}" id="seat${addedChairs}" onclick="sit(${addedChairs}, ${positionCamera[row]})">
                <svg class="seat-icon" viewBox="0 0 24 24"><path d="M0 2a2 2 0 0 1 2-2 2 2 0 0 1 2 2v2h16V2a2 2 0 0 1 2-2 2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2z"></path></svg>
                <svg class="seat-icon-selected" viewBox="0 0 24 24"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path></svg>
            <div>
            `)
            
            addedChairs++
        }
        document.getElementById('seatsWrapper').appendChild(section)
    }
}
function getLoadChairs(){
    let loadedChairs = 0
    AFRAME.registerComponent('chair', {
        init: function () {
            this.el.addEventListener('model-loaded', e => {
                loadedChairs++
                if(loadedChairs === 18) finishLoading()
            })
        }
      });
}
function sit(seat, camera){
    document.querySelector('#camera').object3D.position.set(SeatList[seat].position[0],camera,SeatList[seat].position[2])
    changeCurrentPosition(seat)
    refreshMessageActualPosition()
}
function changeCurrentPosition(seat){
    if(currentPosition !== null) document.querySelector('#seat'+currentPosition).classList.remove('sit')
    document.querySelector('#seat'+seat).classList.add('sit')
    currentPosition = seat
    showCorrectButton()
}

function selectSeat(){
    selectedSeats.push(currentPosition)
    document.querySelector('#seat'+currentPosition).classList.add('selected')

    showCorrectButton()
    refreshList()
}
function unselectSeat(){
    selectedSeats = selectedSeats.filter(position =>position !== currentPosition)
    document.querySelector('#seat'+currentPosition).classList.remove('selected')
    document.querySelector('#seat'+currentPosition).classList.add('sit')

    showCorrectButton()
    refreshList()
}
function showCorrectButton(){
    if(selectedSeats.some(e => e === currentPosition)){
        document.getElementById('selectButton').style.display = 'none'
        document.getElementById('unselectButton').style.display = 'block'
    }else{
        document.getElementById('selectButton').style.display = 'block'
        document.getElementById('unselectButton').style.display = 'none'
    }
}
function refreshList(){
    selectedSeats.length > 0 ? document.querySelector('#containerTickets').style.display = 'block' : document.querySelector('#containerTickets').style.display = 'none'

    let ticketList = document.querySelector('#tickets-list')
    ticketList.innerHTML = ''
    selectedSeats.forEach(position => {
        ticketList.innerHTML+= `<li class="container-tickets__list__item">Row: ${SeatList[position].row} Seat: ${SeatList[position].number} Price: ${ticketPrice}${coin}  </li>`
    });
    ticketList.innerHTML += `<li class="container-tickets__list__item--total">Total: ${selectedSeats.length * ticketPrice}${coin}  </li>`
}
function refreshMessageActualPosition(){
    document.querySelector('#actualLocation').innerHTML = `<p>View from row ${SeatList[currentPosition].row} seat ${SeatList[currentPosition].number}<p>`
}
function finish(){
    alert('Purchased tickets')
}


