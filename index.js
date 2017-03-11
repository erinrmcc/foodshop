var express = require('express');
var server = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var port = process.env.PORT || 8080;
var mongoURI = process.env.MONGOURI || require('./secrets').mongoURI;

//powerup -- middleware
server.use(bodyParser.json()); //handle json data as part of the body
server.use(bodyParser.urlencoded({extended: true}));

//connect to the database
mongoose.connect(mongoURI);
//Create the mongoose schema
var foodSchema = mongoose.Schema({
  price: Number,
  category: String,
  isGlutenFree: Boolean,
  calories: Number
});

//create the mongoose model - capitalized because it's a special case
var Food = mongoose.model('Food', foodSchema);

//testing database stuff
var queso = new Food({
  price: 4.99,
  category: 'Appetizer',
  isGlutenFree: true,
  calories: 350
});
queso.save(function(err, data){
  if(err){
    console.log(err);
  } else {
    console.log(data);
  }
});

var guacamole = new Food({
  price: 6.99,
  category: 'Appetizer',
  isGlutenFree: true,
  calories: 375
});
guacamole.save(function(err, data){
  if(err){
    console.log(err);
  } else {
    console.log(data);
  }
});

var burrito = new Food({
  price: 9.99,
  category: 'Entree',
  isGlutenFree: false,
  calories: 887
});
burrito.save(function(err, data){
  if(err){
    console.log(err);
  } else {
    console.log(data);
  }
});

// GET /foods
server.get('/foods', function(req, res){
  Food.find({}, function(err, documents){
    if(err){
      res.status(500).json({
        msg: err  //do not actually send full error back in production, not secure
      });
    } else {
      res.status(200).json({
        foods: documents
      });
    }
  });
});

//GET /foods/:id
server.get('/foods/:id', function(req, res){
  Food.find({_id: req.params.id}, function(err, documents){
    if(err){
      res.status(500).json({
        msg: err
        });
    } else {
      res.status(200).json({
        foods: documents
      });
    }
  });
});

//GET /foods/category/:categoryName
server.get('/foods/category/:categoryName', function(req, res){
  Food.find({category: req.params.categoryName}, function(err, documents){
    if(err){
      res.status(500).json({
        msg: err
        });
    } else {
      res.status(200).json({
        foods: documents
      });
    }
  });
});

//DELETE /foods/:id
server.delete('/foods/:id', function(req, res){
  Food.remove({_id: req.params.id}, function(err, documents){
    if(err){
      res.status(500).json({
        msg: err
      });
    } else {
      res.status(200).json({
        msg: 'Successfully deleted'
      });
    }
  });
})

//PUT /foods/:id
server.put('/foods/:id', function(req, res){
  food.findOneAndUpdate({_id: req.params.id}, req.body, function(err, documents){
    if(err){
      res.status(500).json({
        msg: err
      });
    } else {
      res.status(200).json({
        msg: 'Succsesfully updated'
      });
    }
  });
});

//POST /foods
server.post('/foods', function(req, res){
  var food = new Food(req.body);
  console.log(req.body);
  food.save(function(err, document){
    if(err){
      res.status(500).json({
        msg: err
      });
    } else {
      res.status(201).json({
        msg: 'Successfully created'
      });
    }
  });
});

//GET  /foods/price/:dollarAmount
server.get('/foods/price/:dollarAmount', function(req, res){
  Food.find({price: req.params.dollarAmount}, function(err, documents){
    if(err){
      res.status(500).json({
        msg: err
      });
    } else {
      res.status(200).json({
        foods: documents
      });
    }
  });
});

//DELETE /foods/category/:category
server.delete('/foods/category/:category', function(req, res){
  Food.remove({category: req.params.category}, function(err, documents){
    if(err) {
      res.status(500).json({
        msg: err
      });
    } else {
      res.status(200).json({
        msg: 'Successfully removed category'
      });
    }
  });
})


server.listen(port, function(){
  console.log('now listening on port...', port);
});
