const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const { update } = require('../models/task')
const router = new express.Router()

router.post('/tasks', auth, (req, res) => {
    const task = new Task({ ...req.body, owner: req.user._id })
    task.save().then(task => {
        res.status(201).send(task)
    }).catch(err => {
        res.status(400).send(err)
    })
})

// URL localhost:3000/tasks?completed=true
// URL localhost:3000/tasks?sortBy=completed:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        console.log(req.query.sortBy)
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] == 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/tasks/mine', auth, async (req, res) => {
    try {
        await req.user.populate('tasks').execPopulate()
        res.send(req.user.tasks)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['completed', 'description']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            res.status(404).send()
        }
        updates.forEach(k => task[k] = req.body[k])
        await task.save()
        res.send(task)
    } catch (err) {
        res.status(400).send(err)
    }
})

// URL localhost:3000/tasks/{id_string}
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    } catch (err) {
        res.status(400).send(err)
    }
})


module.exports = router