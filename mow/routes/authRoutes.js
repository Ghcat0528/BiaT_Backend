const express = require('express');
const bcrypt = require('bcrypt');
const { prisma, generateToken, hashPassword } = require('../common');
const router = express.Router();

router.post('/register', async (req, res) => {
    try{
        const { firstName, lastName, email, password} = req.body;
        const existingUser = await prisma.user.findUnique({ where: {email }});
        if (existingUser) {
            return res.status(400).json({ error: 'User in use already'});
        }
        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: { firstName, lastName, email, password: hashedPassword},
        });
        const token = generateToken(user);
        res.json({ message: 'user registered!', token});
    } catch (error) {
        res.status(500).json({ error: 'Internal server error girl'})
    }
});

router.post('/login', async (req, res) => {
    try{ 
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: {email}});
  if (!user) { 
    return res.status(401).json({ error: 'WRONG email/password'});
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'WRONG email/password'});
  }
  const token = generateToken(user);
  res.json({ message: 'Logged In!', token});
    } catch (error) {
res.status(500).json({ error: 'Internal server error girl'})
    }
});

module.exports = router;