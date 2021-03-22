import createDebug from "debug"
import sanitizeBody from "../middleware/sanitizeBody.js"
import authenticate from "../middleware/authUser.js"
import checkPermission from "../middleware/userPermission.js"
import { Student } from "../models/index.js"
import express from "express"

const debug = createDebug("mad9124-w21-a3-jwt-auth:routes:students")
const router = express.Router()

router.get("/", authenticate, async (req, res) => {
    const student = await Student.find()
    res.send({ data: student })
})

router.post(
    "/",
    authenticate,
    checkPermission,
    sanitizeBody,
    async (req, res) => {
        try {
            const newStudent = new Student(req.sanitizedBody)
            await newStudent.save()
            res.status(201).send({ data: newStudent })
        } catch (err) {
            debug(err)
            res.status(500).send({
                errors: [
                    {
                        status: "500",
                        title: "Server error",
                        description: "Problem saving document to the database.",
                    },
                ],
            })
        }
    }
)

router.get("/:id", authenticate, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
        if (!student) {
            throw new Error("Resource not found")
        }
        res.send({ data: student })
    } catch (err) {
        sendResourceNotFound(req, res)
    }
})

router.put(
    "/:id",
    authenticate,
    checkPermission,
    sanitizeBody,
    async (req, res) => {
        try {
            const student = await Student.findByIdAndUpdate(
                req.params.id,
                req.sanitizedBody,
                {
                    new: true,
                    overwrite: true,
                    runValidators: true,
                }
            )
            if (!student) throw new Error("Resource not found")
            res.send({ data: student })
        } catch (err) {
            sendResourceNotFound(req, res)
        }
    }
)

router.patch(
    "/:id",
    authenticate,
    checkPermission,
    sanitizeBody,
    async (req, res) => {
        try {
            const student = await Student.findByIdAndUpdate(
                req.params.id,
                req.sanitizedBody,
                {
                    new: true,
                    overwrite: true,
                    runValidators: true,
                }
            )
            if (!student) {
                throw new Error("Resource not Found")
            }
            res.send({ data: student })
        } catch (err) {
            sendResourceNotFound(req, res)
        }
    }
)

router.delete("/:id", authenticate, checkPermission, async (req, res) => {
    try {
        const course = await Course.findByIdAndRemove(req.params.id)
        if (!course) {
            throw new Error("Resource not Found")
        }
        res.send({ data: course })
    } catch (err) {
        sendResourceNotFound(req, res)
    }
})

function sendResourceNotFound(req, res) {
    res.status(404).send({
        errors: [
            {
                status: "404",
                title: "Resource does not exist",
                description: `We could not find a student with id: ${req.params.id}`,
            },
        ],
    })
}

export default router
