import createDebug from "debug"
const debug = createDebug("mad9124-w21-a2-mongo-crud:sanitize")
import xss from "xss"

const sanitize = (sourceString) => {
    return xss(sourceString, {
        whiteList: [],
        stripIgnoreTag: true,
        stripIgnoreTagBody: ["script"],
    })
}

const stripTags = (payload) => {
    const attributes = { ...payload }
    for (let key in attributes) {
        if (attributes[key] instanceof Array) {
            attributes[key] = attributes[key].map((element) => {
                return typeof element === "string"
                    ? sanitize(element)
                    : stripTags(element)
            })
        } else if (attributes[key] instanceof Object) {
            attributes[key] = stripTags(attributes[key])
        } else {
            attributes[key] = sanitize(attributes[key])
        }
    }
    return attributes
}

export default function sanitizeBody(req, res, next) {
    debug({ body: req.body })
    const { id, _id, ...attributes } = req.body
    req.sanitizedBody = stripTags(attributes)
    next()
}
