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

router.get('/users', authenticate, async (req, res) => {
    try{
        const users = await prisma.user.findMany({
            select: { id: true, firstName: true, lastName: true, email: true}
        });
        res.json(users)
    } catch (error){
        res.status(500).json({ error: 'Internal server error :('})
    }
});

router.get('/users/:id', authenticate, async (req, res) => {
    try{
        const user = await prisma.user.findUnique({
            where: { id: req.params.id},
            select: { id: true, firstName: true, lastName: true, email: true}
        });
        if (!user) {
            return res,status(404).json({ error: 'User not found...'})
        }
        res.json(user);
    } catch(error) {
        res.status(500).json({ error: 'Internal server error. Sigh'})
    }
});

router.delete('/users/:id', authenticate, async (req, res) => {
    try{ 
        await prisma.user.delete({ where: { id: req.params.id}});
        res.json({message: 'You deleted that ho'});
    } catch (error) {
        res.status(500).json({ error: 'Internal server error. Sigh'})
    }
});
const bcrypt = require('bcryptjs');

router.put('/users/:id', authenticate, async (req, res) => {
    try{ 
        const { firstName, lastName, email, password} = req.body;
        const updateData = { firstName, lastName, email};
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }
        const updatedUser = await prisma.user.update({
            where: { id: req.params.id},
            data: updateData,
            select: { id: true, firstName: true, lastName: true, email: true}
        });
        res.json(updatedUser)
    } catch (error) {
        res.status(500).json({ error: 'Internal server error. Hmm'})
    }
});


module.exports = router;