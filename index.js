//Modules
const express = require('express');
const app = express();
const cors = require('cors');


//Middleware
app.use(cors());
app.use(express.json());

//Create room details
let Room = [{
    roomid: 1,
    roomname: "Meeting Room",
    seatsavailable: 25,
    amenities_available: ["mini theater", "stage", "Sound-bar"],
    priceperhour: 150,
    bookedstatus: true,
}, {
    roomid: 2,
    roomname: "Small function Room",
    seatsavailable: 50,
    amenities_available: ["Projector ", "Projector", "7D audio "],
    priceperhour: 300,
    bookedstatus: false,
}, {
    roomid: 3,
    roomname: "Large function Room",
    seatsavailable: 100,
    amenitiesavailable: ["Projector", "LED-Tv", "Sound-bar","centralized AC"],
    priceperhour: 500,
    bookedstatus: false,
}];

//Create roombookedcustomers
let RoomBookedCustomers = [{
    customername: "selva",
    date: "2023-07-12",
    starttime: "14:00",
    endtime: "16:00",
    roomid: 1
}];

//create customers list
let Customers = [{
    customername: "selva",
    date: "2023-07-12",
    starttime: "14:00",
    endtime: "16:00",
    roomid: 1,
    roomname: "Meeting Room",
    bookingstatus: "Booked"
}]



//endpoint to get all rooms
app.get('/room', (req, res) => {
    res.status(200).json(Room);
});


//endpoint to book Room
app.post('/bookroom/:id', (req, res) => {
    const id = Number(req.params.id);
    const room = Room.find(room => room.roomid === id && room.bookedstatus === false);
    if (room) {

        let Roomname = Room.find(room => room.roomid === id);
        Room = Room.map(room => room.roomid == id ? { ...room, "bookedstatus": true } : room);
        RoomBookedCustomers = RoomBookedCustomers.concat([{ ...req.body, "roomid": id }]);
        Customers = Customers.concat([{ ...req.body, "roomid": id, "roomname": Roomname.roomname,
         "bookingstatus": "Booked" }]);
        res.status(201).json({ message: " booked successfully" });

    } else {
        res.status(404).json({ message: " already booked" });
    }
});

//endpoint to check all booked rooms with customer data
app.get('/bookedroom', (req, res) => {
    let BookedRooms = Room.filter(room => room.bookedstatus === true);
    BookedRooms = BookedRooms.map(room => {
        let customerDetail = RoomBookedCustomers.find(bookedroom => room.roomid === bookedroom.roomid);
        return ({
            "bookedstatus": "Booked",
            "roomname": room.roomname,
            "customername": customerDetail.customername,
            "date": customerDetail.date,
            "starttime": customerDetail.starttime,
            "endtime": customerDetail.endtime,
            "roomid": customerDetail.roomid
        })
    });
    if (BookedRooms.length) {
        res.status(200).json(BookedRooms);
    } else {
        res.status(404).json({ message: "Rooms not booked" });
    }
});

//List all customers with booked data
app.get('/customers', (req, res) => {
    let Customer = Customers.map(customer => {
        let CustomerRoom = Room.find(room => room.roomid === customer.roomid);
        return (customer)
    });
    if (Customer.length) {
        res.status(200).json(Customer);
    } else {
        res.status(404).json({ message: "Rooms booking service not started" });
    }
})

//List how many times customer booked the rooms with customer name
app.get('/customer/:name', (req, res) => {
    let CusName = req.params.name;
    let BookedCustomers = Customers.filter(customer => customer.customername.toLowerCase() === CusName.toLowerCase())
    if (BookedCustomers.length) {
        res.status(200).json(BookedCustomers);
    } else {
        res.status(404).json({ message: "Customer name  not available" });
    }
})

//Remove/delete room booking
app.post('/cancelbooking/:id', (req, res) => {
    const id = Number(req.params.id);
    const room = Room.find(room => room.roomid == id && room.bookedstatus === true);
    if (room) {

        Room = Room.map(room => room.roomid == id ? { ...room, "bookedstatus": false } : room);
        RoomBookedCustomers = RoomBookedCustomers.filter(customer => customer.roomid != id)
        res.status(201).json({ message: "Room booking status successfully changed " });

    } else {
        res.status(404).json({ message: "Room booking not available" });
    }
});


//server listen
const PORT = 8088;
app.listen(PORT, () => {
    console.log("Server Running");
})