const jwt = require('jsonwebtoken');

exports.adminVerifyed = (req, res, next) => {
    let authorization = req.headers.authorization;
    if (authorization) {
        try {
            let payload = jwt.verify(authorization, process.env.adminSecretKey);
            if (payload) {
                req.adminId = payload.adminId;
                next();
            }
        } catch (err) {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
}


exports.superAdminVerifyed = (req, res, next) => {
    let authorization = req.headers.authorization;
    if (authorization) {
        try {
            let payload = jwt.verify(authorization, process.env.superAdminSecretKey);
            if (payload) {
                req.adminId = payload.adminId;
                next();
            }
        } catch (err) {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
}


exports.verifyed = (req, res, next) => {
    let authorization = req.headers.authorization;
    if (authorization) {
        try {
            let adminPayload = jwt.verify(authorization, process.env.adminSecretKey);
            console.log(adminPayload);
            if (adminPayload) {
                req.adminId = adminPayload.adminId;
                next();
            }
        }
        catch {
            try {
                let superAdminPayload = jwt.verify(authorization, process.env.superAdminSecretKey);
                console.log(superAdminPayload);
                if (superAdminPayload) {
                    req.adminId = superAdminPayload.adminId;
                    next();
                }
            }
            catch {
                res.sendStatus(401);
            }
        }

    }
    else {
        res.sendStatus(401);
    }
}
