const express = require('express'); // importing a CommonJS module

const hubsRouter = require('./hubs/hubs-router.js');


const helmet  = require('helmet')
const morgan = require('morgan');
const server = express();

server.use(express.json());
server.use(helmet());
server.use(lockout)


server.use('/api/hubs', hubsRouter);





// Faster to not use devLogger and tinyLogger like this 
// const devLogger = morgan('dev')
// const tinyLogger = morgan('tiny')
// server.use(morgan('dev'));
// server.use(methodLogger)
// server.get('/',devLogger)
// server.delete('/',tinyLogger)
// Use it more compact and faster like this on the job
// server.get('/',morgan('dev'))
// server.delete('/',morgan('tiny'))

server.use(methodLogger);
server.use(addName)


server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
  `);
});


// server.delete('/', (req,res) =>{
//   res.send('deleted');
// })

function methodLogger(req,res,next){
  console.log(`${req.method} request`)
  // res.send('yay')
  next();
}


function addName(req,res,next){
  // req.name = req.name || 'ssssssskkkkk';
  req.name = req.name || req.headers['x-name'];
  next();
}


function lockout(req,res,next){
  res.status(403).json({message: 'api in maintenance mode'})
}

module.exports = server;
