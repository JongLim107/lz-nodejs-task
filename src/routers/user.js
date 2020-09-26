const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sgSendWelcome } = require('../email/account')

const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sgSendWelcome(user.email, user.name)
        const token = await user.generateAuthToken() // method is defined in side of user instance
        res.status(201).send({ user, token })
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCridentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken() // method is defined in side of user instance
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, (req, res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        if (!req.user) {
            res.status(404).send()
        }

        updates.forEach(k => req.user[k] = req.body[k])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e.error)
    }
})

const upload = multer({
    // dest: 'images',
    limits: { fileSize: 165000 },
    fileFilter(req, file, cb) {
        if (file.originalname.match(/\.jpg$/)) {
            cb(undefined, true)
        } else {
            cb(new Error('Not accept file extension!'), false)
        }
    }
})

router.post('/user/avatar', auth, upload.single('data'), async (req, res) => {
    try {
        req.user.avatar = await sharp(req.file.buffer).resize(320, 320).png().toBuffer();
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(400).send(e)
    }
}, (err, req, res, next) => {
    res.status(400).send(err.message)
})

router.get('/user/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set({ 'Content-Type': 'image/png' }).send(user.avatar)

    } catch (e) {
        res.status(404).send()
    }
})

router.delete('/users/avatar', auth, async (req, res) => {
    req.user.avatar = null
    await req.user.save()
    res.send()
})

router.delete('/users/me', auth, async (req, res) => {
    if (!req.user) {
        res.status(404).send()
    }
    try {
        await req.user.remove()
    } catch (err) {
        res.status(400).send(err)
    }
    res.send(req.user)
})

module.exports = router