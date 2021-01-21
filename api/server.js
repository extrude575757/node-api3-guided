const express = require('express'); // importing a CommonJS module

const hubsRouter = require('./hubs/hubs-router.js');


const helmet  = require('helmet')
const morgan = require('morgan');
const server = express();

server.use(express.json());
server.use(helmet());

// server.use(morgan('dev))


server.use(methodLogger)
server.use(addName)
// The date and seconds logger
// server.use(lockout3)




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


// Using the name header 

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Here it is with a name header </h2>
    <p>Welcome  ${req.headers['x-name']} adjustable in postman header param called name</p>
  `);
});
// Vs. Using the nameInsert

// server.get('/', (req, res) => {
//   const nameInsert = (req.name) ? ` ${req.name}` : '';

//   res.send(`
//     <h2>Here it is with a name header </h2>
//     <p>Welcome  ${nameInsert} adjustable in postman header param called name</p>
//   `);
// });



server.delete('/', (req,res) =>{
  res.send('deleted');
})

function methodLogger(req,res,next){
  console.log(`${req.method} request`)
  // res.send('yay')
  next();
}


function addName(req,res,next){
  // req.name = req.name || 'ssssssskkkkk';
  req.name = req.name || req.headers['x-name'];
  // req.name = req.name || req.headers['name']
  next();
}


function lockout(req,res,next){
  res.status(403).json({message: 'api in maintenance mode'})
}

function lockout3(req,res,next){
  const date = new Date();
  const n = date.getSeconds();
  if(Number.isInteger(n / 3)){

    next({code:403,message:'you dont pass ever',
            seconds: n})
    // res.status(403).json({
    //   error:"you dont pass", seconds: n
    // })
  }else{
    next();
  }
}


function lockout2(req,res,next){
  let d = new Date();
  let n = d.getSeconds();
  if(n%3 === 0){
    res.status(403).json({
      message: `You shall not pass today`, sec: n
    }) 
  }else {
    next()
  }
}

// Workzone function
function liveStatus(req,res,next){
  const curDate = new Date();
  res.state(403).json({message: `Non shall pass ${curDate.setSeconds()}`})




}


server.use((error,req,res,next) =>{

// Old way
  // res.status(400).json({
  //   message: 'There was a error',error
  // });
// Code object being used here with code
  res.status(error.code).json({
      message: 'There was a error',error
    });


})


module.exports = server;
