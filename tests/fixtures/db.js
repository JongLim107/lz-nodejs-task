
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const user1Id = new mongoose.Types.ObjectId()
const userOne = {
    "_id": user1Id,
    "name": "Lin Zhong",
    "email": "linzh107@gmail.com",
    "password": "pwd_1234@linzhong",
    "age": 33,
    tokens: [{
        token: jwt.sign({ _id: user1Id.toString() }, process.env.JWT_SECRECT_KEY)
    }]
}

const user2Id = new mongoose.Types.ObjectId()
const userTwo = {
    "_id": user2Id,
    "name": "Lin Zhong",
    "email": "taeyeon@gmail.com",
    "password": "pwd_1234@taeyeon",
    "age": 33,
    tokens: [{
        token: jwt.sign({ _id: user2Id.toString() }, process.env.JWT_SECRECT_KEY)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'UserOne\'s first task',
    owner: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'UserTwo\'s first task',
    owner: userTwo._id
}


const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'UserTwo\'s second task',
    owner: userTwo._id
}

const setupDB = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    setupDB,
    userOne,
    userTwo,
    taskOne,
    taskTwo,
    taskThree
}