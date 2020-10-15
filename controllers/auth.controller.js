const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const authModel = require('../models/auth.model');

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
            expiresIn: '1h'
          })
          res.json({ access_token: token, role: doc.role });
        })
          .catch(err => res.json(err))
      })
    }
  })
}

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
                  expiresIn: "1h",
                });
                res.json({ access_token: token, role: doc.role });
              }
                break
              case 'super-admin': {
                let token = jwt.sign({ superAdminId: doc._id, role: doc.role }, process.env.superAdminSecretKey, {
                  expiresIn: "1h",
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