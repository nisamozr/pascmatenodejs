var express = require('express');
var router = express.Router();
var helpers = require('../helper/helpers')
const { response } = require('express');

const verifyLogin = (req,res)=>{
  if(req.session.logggedIn){
    next()
  }
  else{
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', function(req, res) {
  let user = req.session.user
  if(req.session.logggedIn){
    res.render('index',{user});

  }
  else{
    res.redirect('/login')
  }

});
router.get('/signup', function(req, res) {
 
  res.render('signup',{"loginErr":req.session.loginErr,login:true })
  req.session.loginErr=false
  
  
});
router.get('/login', function(req, res) {
  
  res.render('login',{"loginErr":req.session.loginErr,login:true })
  req.session.loginErr=false
  
  
});
router.post('/signup',function(req,res){
          

  helpers.doSignip(req.body).then((response)=>{
    if(response){
      req.session.logggedIn=true
      req.session.user=response
      res.redirect('/basicinfo')
    }
    else{
      // req.session.loginErr=true
      res.redirect('/signup')

    }

   
    
  })
})

router.post('/login',function(req,res){
 helpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.logggedIn=true
      req.session.user=response.user
      res.redirect('/')
    }
    else{
      req.session.loginErr=true
      res.redirect('/login')

    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/login')
})
// /login and log out completed


router.get('/profile', function(req, res) {
  let user = req.session.user
  if(req.session.logggedIn){
    res.render('profilepage',{user,profile:true});

  }
  else{
    res.redirect('/login')
  }
 
 
});
router.get('/photos', function(req, res) {
  let user = req.session.user
  if(req.session.logggedIn){
    
  res.render('photospage',{user,photos:true});

  }
  else{
    res.redirect('/login')
  }


});
router.get('/videos', function(req, res) {
  let user = req.session.user
  if(req.session.logggedIn){
    res.render('vediospage',{user,video:true});

  }
  else{
    res.redirect('/login')
  }

 
  
});
router.get('/friends', function(req, res) {
  let user = req.session.user
  if(req.session.logggedIn){
    res.render('friendspage',{user,friend:true});

  }
  else{
    res.redirect('/login')
  }

 
  
});
router.get('/about', function(req, res) {
  let user = req.session.user
  if(req.session.logggedIn){
    res.render('aboutpage',{user,about:true});

  }
  else{
    res.redirect('/login')
  }

 
  
});
// setind

router.get('/basicinfo',async (req, res)=> {
  let user = req.session.user
  if(req.session.logggedIn){
    
    res.render('edit-profile-basic',{user,about:true});
    let product = await productHelper.getProductDetailes(req.params.id)
  }
  else{
    res.redirect('/login')
  }

 

});
router.get('/editpassword', function(req, res) {
  let user = req.session.user
  if(req.session.logggedIn){
  
    res.render('edit-password',{user,about:true});

  }
  else{
    res.redirect('/login')
  }

 
});
router.get('/editinterest', function(req, res) {
  let user = req.session.user
  if(req.session.logggedIn){
    res.render('edit-interest',{user,about:true});

  }
  else{
    res.redirect('/login')
  }

 
 
});

router.get('/editeducation', function(req, res) {
  let user = req.session.user
  if(req.session.logggedIn){
    res.render('edit-work-eductation',{user,about:true});

  }
  else{
    res.redirect('/login')
  }

 
  
});
router.get('/notification', function(req, res) {
  let user = req.session.user
  if(req.session.logggedIn){
    res.render('notification',{user,about:true});

  }
  else{
    res.redirect('/login')
  }

 
  
});









module.exports = router;
