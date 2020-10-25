const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const authModel = require('../models/auth.model');


// POST register
exports.register = (req, res) => {
  const body = req.body;
  authModel.findOne({ email: body.email }).then((doc) => {
    if (doc) res.json({ message: 'هذا المستخدم مسجل بالفعل' })
    else {
      bcrypt.hash(body.password, 10).then((hashedPassword) => {
        let newAuth = new authModel({
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          password: hashedPassword
        })
        newAuth.save().then((doc) => {
          const token = jwt.sign({ adminId: doc._id, role: doc.role }, process.env.adminSecretKey, {
            expiresIn: '7h'
          })
          res.json({ access_token: token, role: doc.role });
        })
          .catch(err => res.json(err))
      })
    }
  })
}

// POST login
exports.login = (req, res) => {
  const body = req.body;
  authModel.findOne({ email: body.email }).then((doc) => {
    if (!doc) {
      res.json({ emailMessage: "الايميل الذي ادخلته خطأ" })
    } else {
      bcrypt
        .compare(body.password, doc.password)
        .then((same) => {
          if (!same) {
            res.json({ passwordMessage: "الرقم السري خطأ" })
          } else {
            switch (doc.role) {
              case 'admin': {
                let token = jwt.sign({ adminId: doc._id, role: doc.role }, process.env.adminSecretKey, {
                  expiresIn: '7h',
                });
                res.json({ access_token: token, role: doc.role });
              }
                break
              case 'super-admin': {
                let token = jwt.sign({ adminId: doc._id, role: doc.role }, process.env.superAdminSecretKey, {
                  expiresIn: '7h',
                });
                res.json({ access_token: token, role: doc.role });
              }
                break
            }
          }
        })
        .catch((err) => {
          reject(err);
          mongoose.disconnect();
        });
    }
  })
}


// get all admins
exports.getAllAdmins = (req, res) => {
  authModel.find({}).then((doc) => {
    res.json(doc);
  })
}
// get specific admins with ids
exports.getSpecificAdmins = (req, res) => {
  if (Object.keys(req.body).length !== 0) {
    const ids = req.body;
    const idsArr = [];
    for (let id of ids) {
      idsArr.push({ _id: id })
    }
    authModel.find({ $or: idsArr }).then(doc => {
      res.json(doc);
    })
  }
}

// get admin info
exports.getAdminInfo = (req, res) => {
  authModel.findById(req.adminId).then((doc) => {
    res.json(doc);
  })
}

// PATCH update role
exports.updateRole = (req, res) => {
  authModel.findByIdAndUpdate(req.params.id, {
    role: req.body.role
  }).then((doc) => {
    res.json(doc);
  })
}

// DELETE admin
exports.deleteAdmin = (req, res) => {
  authModel.findOneAndDelete({ _id: req.params.id }).then((doc) => {
    res.json(doc);
  })
}