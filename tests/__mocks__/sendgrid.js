exports = module.exports = function () {

    const emptyRequest = () => { }

    const API = (data, cb) => {
        cb(null, { code: 200, headers: 'email header', body: 'email body' })
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

