const express = require('express');
const authenticate = require('../middle/authMiddleware');
const { prisma } = require('../common');

const router = express.Router();

router.get('/aboutMe', authenticate, async (req, res) => { 
    try{ 
        const user =  await prisma.user.findUnique({ where: {id: req.user.id}})
        if (!user) {
            return res.status(404).json({ error: 'User not founddd'});
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error...'})
    }
});

module.exports = router;