const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
let data;
const positions = {};

function main(data_) {
    
    data = data_;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 50;  // Un rayon un peu plus petit que la moitié de la taille du canvas
    const angleStep = 2 * Math.PI / data.length;  // Angle entre chaque cercle

    

    data.forEach((room, index) => {
        const angle = index * angleStep;
        positions[room.room] = {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
        };
    });


    // Dessin des lignes rouges
    for (let room of data) {
        const startPos = positions[room.room];
        for (let exit of room.exit) {
            const endPos = positions[exit];
            ctx.beginPath();
            if(endPos != null)
                drawArrow(startPos.x, startPos.y, endPos.x, endPos.y);
            ctx.strokeStyle = 'red';
            ctx.stroke();
        }
    }
    // Dessin des ronds bleus
    for (let position in positions) {
        ctx.beginPath();
        ctx.arc(positions[position].x, positions[position].y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.fillStyle = 'white';
        ctx.fillText(position, positions[position].x - 5, positions[position].y + 5);
    }
}
function drawArrow(fromX, fromY, toX, toY) {
    const headlen = 10; // longueur de la pointe de la flèche
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Ajustements pour que la flèche commence et s'arrête aux bords des cercles
    const startX = fromX + (20 * dx / distance);
    const startY = fromY + (20 * dy / distance);
    const endX = toX - (20 * dx / distance);
    const endY = toY - (20 * dy / distance);

    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.lineTo(endX - headlen * Math.cos(angle - Math.PI / 6), endY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - headlen * Math.cos(angle + Math.PI / 6), endY - headlen * Math.sin(angle + Math.PI / 6));
}
function closeModal() {
    document.getElementById('infoModal').style.display = 'none';
}
// Charger le fichier JSON et exécuter la logique principale
fetch('Data30.08.23.json')
    .then(response => response.json())
    .then(data => {
        main(data);
    })
    .catch(error => {
        console.error("Il y a eu un problème avec l'opération fetch: ", error.message);
    });

canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let roomName = "";
    let exitName = "";
    let enterName = [];

    for (let room of data) {
        const pos = positions[room.room];
        const dx = x - pos.x;
        const dy = y - pos.y;

        if (dx * dx + dy * dy < 20 * 20) { // Si le clic est à l'intérieur du cercle (rayon 20)
            // alert(`Cercle: ${room.room}\nLié à: ${room.exit.join(', ')}`);
            // break; // Si on trouve un cercle, inutile de vérifier les autres
            roomName = `${room.room}`;
            exitName = `${room.exit.join(', ')}`;
        }
        
    }
    if(roomName != ""){
        for (let room of data) {
            if(room.exit.includes(roomName)){
                enterName.push(room.room);
            }
        }
        // alert(`Cercle: ${roomName}\nLié à: ${exitName}\nentree depuis: ${enterName.join(', ')}`);    
        const content = `Room: ${roomName}\n\nSortie: ${exitName}\n\nEntree: ${enterName.join(', ')}`;
        document.getElementById('modalContent').innerHTML = content;
        document.getElementById('infoModal').style.display = 'block'; // Afficher la fenêtre modale
    }
    
});

document.getElementById('searchButton').addEventListener('click', function() {
    const searchTerm = document.getElementById('searchInput').value;
    const position = positions[searchTerm];

    if (position) {
        window.scrollTo(position.x - window.innerWidth / 2, position.y - window.innerHeight / 2);
    } else {
        alert('Room non trouvé.');
    }
});




