import createDebug from "debug"
const debug = createDebug("mad9124-w21-a3-jwt-auth:db")
import mongoose from "mongoose"

export default function () {
    mongoose
        .connect("mongodb://localhost:27017/mad9124", {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        })
        .then(() => debug("Connected to MongoDB ..."))
        .catch((err) => {
            debug("Problem connecting to MongoDB ...", err.message)
            process.exit(1)
        })
}
