const app = require('../src/app')
const request = require('supertest')
const User = require('../src/models/user')

const { setupDB, userOne } = require('./fixtures/db')

beforeEach(setupDB);

test('Should able to create new user', async () => {
    const response = await request(app).post('/users')
        .send({
            "name": "Kim Taeyeon",
            "email": "taeyeonK989@gmail.com",
            "password": "pwd_1234@taeyeon",
            "age": 31,
        })
        .expect(201)

    const user = await User.findById(response.body.user._id)
    console.log('Create ', user._id)
    expect(user).not.toBeNull()
    expect(response.body).toMatchObject({
        user: {
            name: "Kim Taeyeon",
            email: "taeyeonK989@gmail.com".toLowerCase()
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('pwd_1234@taeyeon')
})

test('Should able to login user', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        }).expect(200)

    const user = await User.findById(userOne._id)

    expect(response.body).toMatchObject({
        user: {
            "name": "Lin Zhong",
            "email": "linzh107@gmail.com".toLowerCase()
        },
        token: user.tokens[1].token
    })
})

test('Should not able to login user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: 'thisnotpassword'
        }).expect(400)
})

test('Should get user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Shouldn not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should update user name/age', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ name: 'New Name', age: 27 })
        .expect(200)
})

test('Should not update user email', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ email: 'linzhong@gmail.com' })
        .expect(400)
})

test('Should not update user name without authenticated', async () => {
    await request(app)
        .patch('/users/me')
        .send({ name: 'notauthenticated' })
        .expect(401)
})

test('Should upload user avatar', async () => {
    await request(app)
        .post('/user/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('data', 'tests/fixtures/taeyeon-nylon.jpg')
        .expect(200)
})

test('Should not delete user unauthenticated', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should delete user unauthenticated', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(userOne._id)
    expect(user).toBeNull()
})