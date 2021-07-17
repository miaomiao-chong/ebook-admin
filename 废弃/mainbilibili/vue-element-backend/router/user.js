const express = require('express')

const router = express.Router()

router.get('/info', (req, res, next)=> {
  res.send('/info')
})

module.exports = router