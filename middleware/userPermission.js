import User from "../models/User.js"

export default async function checkPermission (req, res, next) {
    const user = await User.findById(req.user)
    if (user.isAdmin == true) {
        next()
    } else {
        return res.status(401).send({
            errors: [
                {
                    status: "401",
                    title: "Unauthorized",
                    description:
                        "You do not have the correct permission to perform this action",
                },
            ],
        })
    }
}

