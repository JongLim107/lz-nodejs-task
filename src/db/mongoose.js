
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOOSE_DATA_API, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});
