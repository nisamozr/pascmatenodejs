var express = require('express');
var router = express.Router();
var helpers = require('../helper/helpers')
const { response } = require('express');



const verifyLogin = (req, res, next) => {
  if (req.session.logggedIn) {
    next()
  }
  else {
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', function (req, res) {
  let user = req.session.user
  if (req.session.logggedIn) {
    // helpers.homePost().then((response) => {
      // post=req.response.post


      res.render('index', { user });
    // })

   
    

  }
  else {
    res.redirect('/login')
  }

});
router.get('/signup', function (req, res) {

  res.render('signup', { "loginErr": req.session.loginErr, login: true })
  req.session.loginErr = false


});
router.get('/login', function (req, res) {

  res.render('login', { "loginErr": req.session.loginErr, login: true })
  req.session.loginErr = false


});
router.post('/signup', function (req, res) {


  helpers.doSignip(req.body).then((response) => {
    if (response) {
      req.session.logggedIn = true
      req.session.user = response
      res.redirect('/basicinfo')
    }
    else {
      // req.session.loginErr=true
      res.redirect('/signup')

    }



  })
})

router.post('/login', function (req, res) {
  helpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.logggedIn = true
      req.session.user = response.user
      res.redirect('/')
    }
    else {
      req.session.loginErr = true
      res.redirect('/login')

    }
  })
})
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/login')
})
// /login and log out completed


router.get('/profile',verifyLogin,async function (req, res) {
  let user = req.session.user

let userposts = await helpers.getUserPost(req.session.user._id)
console.log(userposts)
console.log(req.session.user)
  res.render('profilepage', { user, profile: true, userposts });

  

 


  


});
router.get('/photos', function (req, res) {
  let user = req.session.user
  if (req.session.logggedIn) {

    res.render('photospage', { user, photos: true });

  }
  else {
    res.redirect('/login')
  }


});
router.get('/videos', function (req, res) {
  let user = req.session.user
  if (req.session.logggedIn) {
    res.render('vediospage', { user, video: true });

  }
  else {
    res.redirect('/login')
  }



});
router.get('/friends', function (req, res) {
  let user = req.session.user
  if (req.session.logggedIn) {
    res.render('friendspage', { user, friend: true });

  }
  else {
    res.redirect('/login')
  }



});
router.get('/about', function (req, res) {
  let user = req.session.user
  if (req.session.logggedIn) {
    res.render('aboutpage', { user, about: true });

  }
  else {
    res.redirect('/login')
  }



});
// setind

router.get('/basicinfo', async (req, res) => {
  let user = req.session.user
  if (req.session.logggedIn) {

    res.render('edit-profile-basic', { user, about: true });
    console.log(req.session.user._id)

  }
  else {
    res.redirect('/login')
  }



})
router.post('/basicinfo', verifyLogin, (req, res) => {

  helpers.updateUserInfo(req.session.user._id, req.body).then((response) => {

    res.redirect('/editeducation')
    console.log(req.session.user._id)



  })
})




router.get('/editpassword', function (req, res) {
  let user = req.session.user
  if (req.session.logggedIn) {

    res.render('edit-password', { user, about: true });

  }
  else {
    res.redirect('/login')
  }


});
router.get('/editinterest', function (req, res) {
  let user = req.session.user
  if (req.session.logggedIn) {
    res.render('edit-interest', { user, about: true });

  }
  else {
    res.redirect('/login')
  }



});
router.post('/editinterest', verifyLogin, (req, res) => {

  helpers.InsertIntrest(req.session.user._id, req.body).then((response) => {

    res.redirect('/editinterest')
    console.log(req.session.user._id)



  })
})
router.get('/delete-intrest/:intrest', verifyLogin, (req, res) => {
  let intest = req.params.intrest
  console.log(intest)
  helpers.deleteINtrest(req.session.user._id, intest).then((response) => {
    res.redirect('/editinterest')
  })





})


router.get('/editeducation', function (req, res) {
  let user = req.session.user
  if (req.session.logggedIn) {
    res.render('edit-work-eductation', { user, about: true });

  }
  else {
    res.redirect('/login')
  }
  router.post('/editeducation', verifyLogin, (req, res) => {

    helpers.updateEducation(req.session.user._id, req.body).then((response) => {

      res.redirect('/editinterest')
      console.log(req.session.user._id)



    })
  })



});
router.get('/notification', function (req, res) {
  let user = req.session.user
  if (req.session.logggedIn) {
    res.render('notification', { user, about: true });

  }
  else {
    res.redirect('/login')
  }



});


router.post('/editprofilpic', verifyLogin, (req, res) => {
  helpers.uploadeDp(req.session.user._id, req.files).then((response) => {
    let image = req.files.profilImage;
    image.mv('./public/userData/ProfilePic/' + req.session.user._id + '.jpg', (err, done) => {
      if (!err) {
        res.redirect("/profile")
      }
      else {
        console.log(err)
      }
    })
    res.render('/profile')
  })
})



router.post('/editCover', verifyLogin, (req, res) => {


  let image = req.files.coverPhoto
  image.mv('./public/userData/Cover/' + req.session.user._id + '.jpg', (err, done) => {
    if (!err) {
      res.render("/profile")
    }
    else {
      console.log(err)
    }
  })
  res.redirect('/profile')
})

router.post('/addPost', verifyLogin, (req, res) => {
  var imagename
  var videoname
  if (req.files.image) {
   var imagename = "userData/Post/" + new Date() + req.files.image.name
    let image = req.files.image
    image.mv("./public/"+imagename, (err, done) => {
      if (!err) {
        res.redirect("/")
      }
      else {
        console.log(err)
      }
    })
  }

  else if (req.files.video) {

    var videoname = "userData/Post/videos/" + new Date() + req.files.video.name
    var video =req.files.video

    
    video.mv("./public/"+videoname, (err, done) => {
      if (!err) {
        res.redirect("/")
      }
      else {
        console.log(err)
      }
    })
   

  }





  helpers.addPost(req.session.user, req.body, imagename, videoname).then((response) => {


    res.redirect("/profile")
  })
})









module.exports = router;
