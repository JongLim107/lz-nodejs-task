
const app = require('./app')
const port = process.env.PORT // heroku will assign a value
 
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})