let os = require('os')
let path = require('path')
var mysql = require('mysql')
let multer = require('multer')
let express = require('express')

require('../common/date.js')
let db = require('../db.js')
let user = require('../controller/user')
let {getClientIP, getServerIP} = require('../common/system')

let router = express.Router()
let upload = multer({dest: path.resolve(__dirname, '../../resource/images/gossip')})

router.get('/get-system-info', function (req, res, next) {
  let clientIP = getClientIP(req),
      serverIP = getServerIP()

  clientIP = clientIP.substr(clientIP.lastIndexOf(':') + 1)
  db.query('select version() as v', function (err, rows) {
    res.json({status: 1, info: {serverIP: serverIP, serverVersion: os.release(),
                clientIP: clientIP, clientVersion: req.headers['user-agent'], dbVersion: rows[0]['v']} })
  })
})

router.get('/get-articles', function (req, res, next) {
  db.query('select id, title, type, tag, created_at, views from article \
      where status = 1 order by id desc', function (err, rows) {
    if (err) {
      res.json({status: 0, message: 'Query Failed'})
    } else {
      res.json({status: 1, info: rows})
    }
  })
})

router.get('/article/:id', function (req, res, next) {
  let id = req.params
  db.query('select id, title, body, type, category, tag, markdown from article \
      where id=${+id} and status = 1', function (err, rows) {
    if (err) {
      res.json({status: 0, message: 'Query Failed'})
    } else {
      if (rows.length === 1) {
        res.json({status: 1, info: rows[0]})
      } else {
        res.json({status: 1, info: {}})
      }
    }
  })
})

router.post('/article-submit', function (req, res, next) {
  let {id, content, title, tag, category, type, markdown} = req.body
  let sql = ""
  if (id != null) {
    sql = `update article set body = ${mysql.escape(content)}, title = ${mysql.escape(title)}, tag = ${mysql.escape(tag)},
        category = ${category}, type = ${type}, updated_at = "${new Date().toLocaleDateString()}" where id = ${+id}`
  } else {
    sql = `insert into article(title, tag, category, type, created_at, body, markdown) values (${mysql.escape(title)},
        ${mysql.escape(tag)}, ${category}, ${type}, "${new Date().toLocaleDateString()}", ${mysql.escape(content)}, ${markdown})`
  }
  
  db.query(sql, function (err, rows) {
    if (err) {
      console.log(err)
      res.json({status: 0, message: 'Query Failed'})
    } else {
      res.json({status: 1})
    }
  })
})

router.get('/get-gather', function (req, res, next) {
  db.query('select id, title, tag, created_at from gather where status = 1 order by id desc', function (err, rows) {
    if (err) {
      res.json({status: 0, message: 'Query Failed'})
    } else {
      res.json({status: 1, info: rows})
    }
  })
})

router.get('/gather-delete/:id', function (req, res, next) {
  let {id} = req.params
  db.query(`update gather set status = 0 where id = ${+id}`, function (err, rows) {
    if (err) {
      res.json({status: 0, message: 'Query Failed'})
    } else {
      res.json({status: 1})
    }
  })
})

router.get('/gather/:id', function (req, res, next) {
  let {id} = req.params
  db.query(`select id, title, detail, tag from gather where id = ${+id} and status = 1`, function (err, rows) {
    if (err) {
      res.json({status: 0, message: 'Query Failed'})
    } else {
      if (rows.length === 1) {
        res.json({status: 1, info: rows[0]})
      } else {
        res.json({status: 1, info: {}})
      }
    }
  })
})

router.post('/gather-submit', function (req, res, next) {
  let sql = ''
  let {id, content, title, tag} = req.body
  
  if (id !== null) {
    sql = `update gather set detail = ${mysql.escape(content)}, title = ${mysql.escape(title)}, 
        tag = ${mysql.escape(tag)}, updated_at = "${new Date().toLocaleDateString()}", ${mysql.escape(content)}`
  } else {
    sql = `insert into gather(title, tag, created_at, detail) value (${mysql.escape(title)}, 
        ${mysql.escape(tag)}, "${new Date().toLocaleDateString()}", ${mysql.escape(content)})`
  }
  
  db.query(sql, function (err, rows) {
    if (err) {
      console.log(err)
      res.json({status: 0, message: 'Query Failed'})
    } else {
      res.json({status: 1})
    }
  })
})

router.get('/get-gossip', function (req, res, next) {
  db.query(`select id, detail, created_at from gossip order by id desc`, function (err, rows) {
    if (err) {
      res.json({status: 0, message: 'Query Failed'})
    } else {
      res.json({status: 1})
    }
  })
})

router.get('/gossip-delete/:id', function (req, res, next) {
  let {id} = req.params
  db.query(`delete from gossip where id = ${+id}`, function (err, rows) {
    if (err) {
      res.json({status: 0, message: 'Delete Failed'})
    } else {
      res.json({status: 1})
    }
  })
})

router.get('/gossip/:id', function (req, res, next) {
  let {id} = req.params
  db.query(`select id, detail, file_name, save_name from gossip where id = ${+id}`, function (err, rows) {
    if (err) {
      res.json({status: 0, message: 'Query Failed'})
    } else {
      if (rows.length === 1) {
        res.json({status: 1, info: rows[0]})
      } else {
        res.json({status: 1, info: {}})
      }
    }
  })
})

router.post('/gossip-submit', upload.single('file'), function (req, res, next) {
  let sql = "", fileName = null, saveName = null
  let {id, detail} = req.body

  if (req.file) {
    fileName = req.file.originalname
    saveName = req.file.filename
  }
  if (id !== NULL) {
    sql = `update gossip set detail = ${mysql.escape(detail)}, file_name = ${mysql.escape(fileName)},
        save_name = ${mysql.escape(saveName)}, updated_at= "${new Date()._format("yyyy-MM-dd hh:mm:ss")}" where id = ${+id}`
  } else {
    sql = `insert into gossip(detail, created_at, file_name, save_name) values (${mysql.escape(detail)}), 
        "${new Date()._format("yyyy-MM-dd hh:mm:ss")}", ${mysql.escape(fileName)}, ${mysql.escape(saveName)}`
  }

  db.query(sql, function (err, rows) {
    if (err) {
      console.log(err)
      res.json({status: 0, message: 'Query Failed'})
    } else {
      res.json({status: 1})
    }
  })
})

router.get('/get-categories', function (req, res, next) {
  db.query(`select id, theme from category where status = 1`, function (err, rows) {
    if (err) {
      res.json({status: 0, message: 'Query Failed'})
    } else {
      res.json({status: 1, info: rows})
    }
  })
})

router.get('*', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../../public/index.html'))
})

module.exports = router