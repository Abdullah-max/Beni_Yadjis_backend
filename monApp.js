const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')

const app = express();
const connection = mongoose.connection;
const Utilisateur = require('./models/utilisateur');
const { find } = require ('./models/utilisateur');
const utilisateur = require('./models/utilisateur');
const Message = require('./models/message');
const Event = require('./models/Event');
const Job = require('./models/job');
const Left = require('./models/left');



app.use(express.json())
app.use(cookieParser('123abc'))
// app.use(bodyparser.json());
// app.use(bodyparser.urlencoded({ extended:false}));
app.use(cors(
    {
    origin: ['http://localhost:3000'],
    credentials: true
}
));

app.listen(3040,()=>{
    console.log("j'ecoute le port 3040");
});

//connection avec mongoose

//mongoose.connect('mongodb+srv://Baker:ecologie2010@cluster0.yymxq.mongodb.net/projet',{useUnifiedTopology: true, useNewUrlParser: true });
mongoose.connect('mongodb+srv://electrics1234:electrics1234@cluster0.1of7i.mongodb.net/beni?retryWrites=true&w=majority',{useUnifiedTopology: true, useNewUrlParser: true });
connection.once('open',()=>{
    console.log('Connected to MongoDB');
   });

// Afficher la liste des utilisateur
app.get('/utilisateur',(req,res)=>{
    Utilisateur.find()
    .exec()
    .then(utilisateur => res.status(200).json(utilisateur));
});

// Afficher la liste des messages
app.get('/messageList',(req,res)=>{
    Message.find()
    .exec()
    .then(message => res.status(200).json(message));
});
// Afficher la liste des evenements
app.get('/event',(req,res)=>{
    Event.find()
    .exec()
    .then(event => res.status(200).json(event));
});
// Ajouter un membre
app.post('/register1',(req, res)=>{

    console.log('req.body',req.body);
    
    Utilisateur.findOne({email:req.body.email},(req,res) => {
        if(utilisateur){
            res.send ({message : "Email deja existe"});
        } else {
            const doct = new Doct(req.body);
    doct.save((err, doct)=>{
        if(err){
            return res.status(500).json(err);
        }
        res.status(201).json(doct);
    });
    }

    })
    
});

//modifier un utilisateur

app.put('/moduser/:id',(req,res)=>{
    const id = req.params.id;
    Utilisateur.findByIdAndUpdate(id,req.body, function (err, utilisateur) {  
        if (err) res.json(err);  
        else {
         res.json({ 
            "message": `lutilisateur avec l'id ${utilisateur._id} a ete modifier`, 
          });  
        }  
      });
});

// supprimer un utilisateur

app.delete('/deluser/:id',(req,res)=>{

    const id = req.params.id;
    Utilisateur.findByIdAndDelete(id, (err,utilisateur) =>{
        if(err){
            return res.status(500).json(err);
        }
        res.status(202).json({ msg:`l'utilisateur avec l'id ${utilisateur._id} est supprime`});
    });
});
//code pour enrigistre un nouveau membre
app.post('/register',(req,res)=>{
    const utilisateur = new Utilisateur(req.body);
    utilisateur.save((err, utilisateur)=>{
        if(err){
            return res.status(500).json(err);
        }
        res.status(201).json(utilisateur);
    });

})

// code pour login d'un utilisateur

app.post('/login', (req,res)=>{
    const {email, password} = req.body;
    
    Utilisateur.findOne({email}).exec((err, utilisateur)=> {
        
        if (utilisateur){
            if(password === utilisateur.password){
                
                const userObject = {
                    userid: utilisateur._id,
                    username: utilisateur.name,
                    email: utilisateur.email,
                    isAdmin: utilisateur.isAdmin
                }
                // jwt set
                const token = jwt.sign(userObject, '123abc', {
                    expiresIn: 30*24*60*60*1000,
                  });
                  console.log(token);
                // set cookies
                res.cookie('token', token, {
                    maxAge: 24*60*60*1000,
                    httpOnly: true,
                    signed: true,
                  }).json({message: 'Login success!'})
                // res.send({message: " "});
            }else{
                res.status(400).json({message: "password incorrect"})
            }
            // else{
            //     console.log(email);
            //     res.send({message: " password incorrect"});
            // }
            
        }else{
            res.status(404).json({message: 'Email not found!'})
        }
            
      });
});

app.get('/loggedIn', (req, res) => {
    try {
        const token = req.signedCookies.token
        if(!token) return res.json({
            success: false,
            isAdmin: false
        })
        const user = jwt.verify(token, '123abc')
        req.user = user
        res.json({success: true, isAdmin: user.isAdmin})
    } catch (error) {
        res.json({
            message: 'error',
            success: false,
            isAdmin: false
        })
    }
})

app.get('/logout',(req, res)=>{
        res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: "none",
    })
    .send({message: 'Logout'});
})


//code pour Envoyer un messasge
app.post('/messageAdd',(req,res)=>{
    const message = new Message(req.body);
    message.save((err, message)=>{
        if(err){
            return res.status(500).json(err);
            console.log("erreur cooriger");
        }
        res.status(201).json(message);
        console.log(message);
    });

})
// supprimer un message

app.delete('/delmsg/:id',(req,res)=>{

    const id = req.params.id;
    Message.findByIdAndDelete(id, (err,message) =>{
        if(err){
            return res.status(500).json(err);
        }
        res.status(202).json({ msg:`le message avec l'id ${message._id} est supprime`});
    });
});
//code pour ajouter un eventement
app.post('/AddEvent',(req,res)=>{
    const event = new Event(req.body);
    event.save((err, event)=>{
        if(err){
            return res.status(500).json(err);
            console.log("erreur corriger");
        }
        res.status(201).json(event);
        console.log(event);
    });

})
// supprimer un evenement

app.delete('/delEvent/:id',(req,res)=>{

    const id = req.params.id;
    Event.findByIdAndDelete(id, (err,event) =>{
        if(err){
            return res.status(500).json(err);
        }
        res.status(202).json({ msg:`le evenment avec l'id ${event._id} est supprime`});
    });
});
//modifier un evenemet

app.put('/modEvent/:id',(req,res)=>{
    const id = req.params.id;
    Event.findByIdAndUpdate(id,req.body, function (err, event) {  
        if (err) res.json(err);  
        else {
         res.json({ 
            "message": `levenement avec l'id ${event._id} a ete modifier`, 
          });  
        }  
      });
});

// Afficher la liste des offres demplois
app.get('/job',(req,res)=>{
    Job.find()
    .exec()
    .then(job => res.status(200).json(job));
});

//code pour ajouter un emploi
app.post('/AddJob',(req,res)=>{
    const job = new Job(req.body);
    job.save((err, job)=>{
        if(err){
            return res.status(500).json(err);
            console.log("erreur corriger");
        }
        res.status(201).json(job);
        console.log(job);
    });

})
// supprimer un evenement

app.delete('/delJob/:id',(req,res)=>{

    const id = req.params.id;
    Job.findByIdAndDelete(id, (err,job) =>{
        if(err){
            return res.status(500).json(err);
        }
        res.status(202).json({ msg:`loffre demploi avec l'id ${job._id} est supprime`});
    });
});
//modifier un offre demploi

app.put('/modJob/:id',(req,res)=>{
    const id = req.params.id;
    Job.findByIdAndUpdate(id,req.body, function (err, job) {  
        if (err) res.json(err);  
        else {
         res.json({ 
            "message": `loffre avec l'id ${job._id} a ete modifier`, 
          });  
        }  
      });
});


// Afficher la liste des offres de covoiturage
app.get('/left',(req,res)=>{
    Left.find()
    .exec()
    .then(left => res.status(200).json(left));
});

//code pour ajouter unoffrede co-voiturage
app.post('/AddLeft',(req,res)=>{
    const left = new Left(req.body);
    left.save((err, left)=>{
        if(err){
            return res.status(500).json(err);
            console.log("erreur corriger");
        }
        res.status(201).json(left);
        console.log(left);
    });

})
// supprimer un covoiturage

app.delete('/delLeft/:id',(req,res)=>{

    const id = req.params.id;
    Left.findByIdAndDelete(id, (err,left) =>{
        if(err){
            return res.status(500).json(err);
        }
        res.status(202).json({ msg:`loffre de covoiturage avec l'id ${left._id} est supprime`});
    });
});
//modifier un offre demploi

app.put('/modleft/:id',(req,res)=>{
    const id = req.params.id;
    Joleftb.findByIdAndUpdate(id,req.body, function (err, left) {  
        if (err) res.json(err);  
        else {
         res.json({ 
            "message": `loffre avec l'id ${left._id} a ete modifier`, 
          });  
        }  
      });
});

// add comment

app.post('/comment/:id', (req, res)=>{
    Left.findOne({_id: req.params.id}).exec(async(err, event)=>{
        if(err) return res.status(400).json({err})
        const comment = req.body.comment
        const com = {
            comment: comment
        }
        event.comments.push(com)
        await event.save()
        return res.status(200).json({event})
    })
})