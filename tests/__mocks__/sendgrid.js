exports = module.exports = function () {

    const emptyRequest = () => { }

    const API = (data, cb) => {
        cb(null, { statusCode: 200, headers: 'testing header', body: 'testing body' })
    }

    return { API, emptyRequest }

}

exports.mail = {
    Email: class {
        constructor() {
            return 'sendToEmail'
        }
    },
    Content: class {
        constructor() {
            return 'sendContent'
        }
    },
    Mail: class {
        constructor() {
            return 'sendToMail'
        }
        toJSON() {

        }
    }
}

