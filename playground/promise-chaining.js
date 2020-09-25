require('../src/db/mongoose')

const User = require('../src/models/user')

User.findByIdAndUpdate('5f6616d7c07f684af72b3db4', { name: 'SONE' }).then(user => {
    console.log('FindByIdAndUpdate', user)
    return User.countDocuments({ name: 'SONE' }).then(user1 => {
        console.log('countDocuments', user1)
    })
}).catch(err => {
    console.log(err)
})
