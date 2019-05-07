const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/testAuthorization',{ useNewUrlParser : true})
.then((   ) => console.log('connected MongDB'),
      (err) => console.log(err))

mongoose.set('useCreateIndex', true)