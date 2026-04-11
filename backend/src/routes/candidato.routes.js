const express = require('express');
const router = express.Router();

// GET de prueba
router.get('/', (req, res) => {
    res.json({ mensaje: 'Candidatos funcionando' });
});

module.exports = router;