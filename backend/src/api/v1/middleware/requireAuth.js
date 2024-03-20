const jwt = require('jsonwebtoken')
const Student = require('../models/student.model')
const Club = require('../models/club.model')

const requireAuth = async (req, res, next) => {
    //Verify Authentication
    const { authorization } = req.headers

    if (!authorization) {
        console.log({ error: 'Authorization token required' });
        return res.status(401).json({ error: 'Authorization token required' })
    }

    const token = authorization.split(' ')[1]

    try {
        const { _id } = jwt.verify(token, process.env.SECRET)

        const club = await Club.findOne({ _id }).select('_id type')
        const student = await Student.findOne({ _id }).select('_id type')

        if (!student) {
            req.user = club
        } else if (!club){
            req.user = student
        }

        if (!req.user) {
            throw new Error("User does not exist")
        }

        next()
    } catch (error) {
        console.log(error.message);
        res.status(401).json({ error: 'Request is not authorized' })
    }
}

module.exports = requireAuth