// CRUD create read update delete

const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017' // can not use localhost
const databaseName = 'task-manager'

const id = new ObjectID()
console.log('ID', id, id.getTimestamp(), id.id.length, id.toHexString().length)

MongoClient.connect(connectionURL, {
	useUnifiedTopology: true,
	useNewUrlParser: true
}, (error, client) => {
	if (error) {
		return console.log('Unable to connect to database!')
	}

	const db = client.db(databaseName)

	// db.collection('user').drop().then(result => {
	// 	if (result) console.log(result)
	// }).catch(err => {
	// 	console.log('Drop user collection', err.name)
	// })

	// db.collection('task').insertOne({
	// 	description: 'Download MTV tonight.'
	// }, (error, result) => {
	// 	if (error) {
	// 		return console.log('Unable to insert task!')
	// 	}
	// 	console.log(result.ops)
	// })

	// db.collection('users').insertMany([
	// 	{ _id: id, name: 'LZ', age: 32 },
	// 	{ name: 'Taeyeon', age: 31 },
	// 	{ name: 'Shungui', age: 31 }
	// ], (error, result) => {
	// 	if (error) {
	// 		return console.log('Unable to insert users!')
	// 	}

	// 	console.log(result.ops)
	// })

	db.collection('users').findOne({
		age: 31
	}, (err, user) => {
		if (err) {
			return console.log(err)
		}

		console.log('Findone', user)
	})

	db.collection('users').find({
		age: 31
	}).toArray((err, user) => {
		if (err) {
			return console.log(err)
		}

		console.log('Find and covert to an Array', user)
	})

	// db.collection('users').deleteMany({ age: 31 }).then(result => {
	//     if (result) return console.log(result)
	//     console.log('Remove users named LZ!')
	// })
})