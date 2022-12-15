import express from 'express'
import {APP_URL, PORT, DATABASE_URL} from './config/index.js';
// import connectDB from "./db/connectDB.js";
import connectDB from "./config/connectDB.js";
import errorHandler from './middlewares/errorHandler.js';
import routes from './routes/index.js';
import path from 'path';
import cors from 'cors'

const app = express()  
 
// const port = process.env.PORT || '8000'
// const DATABASE_URL = process.env.DATABASE_URL || "mongodb+srv://rohitnamdeo:rohitnamdeo123@cluster0.vkr7r.mongodb.net/consoft";
const port = PORT;

// Database Connection
connectDB(DATABASE_URL);

//global
global.appRoot = path.resolve();

app.use(cors())
// app.use(express.urlencoded({ extended: false}));

app.use(express.urlencoded({ limit: "10mb", extended: false, parameterLimit: 10000 }))

// JSON  
// app.use(express.json()) 
app.use(express.json({ limit: '10mb' })) 

// Load Routes
app.use('/api', routes);
app.use('/uploads', express.static('uploads'));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening at ${APP_URL}`)
})  


//-----------------------------------
// WebSocket Here
// import express from 'express'
// import {PORT, APP_URL, WS_PORT, DATABASE_URL} from './config/index.js';
// import connectDB from "./config/connectDB.js";
// import routes from './routes/index.js';
// import path from 'path';
// import cors from 'cors'
// import WebSocket from 'ws';

// const app = express();

// const port = PORT;

// // Database Connection
// connectDB(DATABASE_URL);

// app.use(cors());

// app.use(express.json({ limit: '5mb' })) 

// app.use('/api', routes);
// app.use('/uploads', express.static('uploads'));

// const wsServer = new WebSocket.Server({port: WS_PORT}, ()=> console.log(`WS Server is listening at ${WS_PORT}`));
// wsServer.on('connection', (ws, req) => {
//     console.log('A new client is connected');
//     ws.send(" Send Data ddjasdjas sfjsdfsdj sdd fsjdfhsdj");

//     ws.on('message', (data) =>{
//         console.log(data.toString());
//     });
// })

// app.get("/", (req, res) => res.sendFile(path.resolve("./index.html")));

// app.listen(port, () => {
//     console.log(`Server listening at ${APP_URL}`)
// }) 

