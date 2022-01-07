const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Héroes del silencio'));
bands.addBand(new Band('Metalica'));
bands.addBand(new Band('Recodo'));



// Mensajes de sockets
io.on('connection', client => {

    console.log('cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('cliente desconectado');
    });


    client.on('mensaje', (payload) => {
        console.log('mensaje', payload);

        io.emit('mensaje', { admin: 'Nuevo mensaje' });

    });

    /*
    client.on('emitir-mensaje', (payload) => {
        //console.log('nuevo mensaje', payload);

        // io.emit('nuevo-mensaje', payload); se lo emite a todos
        client.broadcast.emit('nuevo-mensaje', payload); // se lo emite a todos menos al cliente que lo emitió

    });
    */

    client.on('vote-band', (payload) => {

        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());

    });

    client.on('add-band', (payload) => {

        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands());

    });

    client.on('delete-band', (payload) => {

        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());

    });





});