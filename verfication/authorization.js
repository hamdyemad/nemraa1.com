const jwt = require('jsonwebtoken');


// admin verfid
exports.adminVerifyed = (req, res, next) => {
    let authorization = req.headers.authorization;
    if (authorization) {
        try {
            let payload = jwt.verify(authorization, process.env.adminSecretKey);
            if (payload) {
                req.adminId = payload.adminId;
                req.role = payload.role;
                next();
            }
        } catch (err) {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
}


// super admin verifed
exports.superAdminVerifyed = (req, res, next) => {
    let authorization = req.headers.authorization;
    if (authorization) {
        try {
            let payload = jwt.verify(authorization, process.env.superAdminSecretKey);
            if (payload) {
                req.adminId = payload.adminId;
                req.role = payload.role;
                next();
            }
        } catch (err) {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
}

// super admin and admin verifed
exports.superAndAdminVerifed = (req, res, next) => {
    let authorization = req.headers.authorization;
    if (authorization) {
        try {
            let adminPayload = jwt.verify(authorization, process.env.adminSecretKey);

            if (adminPayload) {
                req.adminId = adminPayload.adminId;
                req.role = adminPayload.role;
                next();
            }
        }
        catch (err) {
            try {
                let superAdminPayload = jwt.verify(authorization, process.env.superAdminSecretKey);

                if (superAdminPayload) {
                    req.adminId = superAdminPayload.adminId;
                    req.role = superAdminPayload.role;
                    next();
                }
            }
            catch (err) {
                res.sendStatus(401);
            }
        }

    }
    else {
        res.sendStatus(401);
    }
}


// any admin signature
exports.verifyed = (req, res, next) => {
    let authorization = req.headers.authorization;
    if (authorization) {
        try {
            let adminPayload = jwt.verify(authorization, process.env.adminSecretKey);

            if (adminPayload) {
                req.adminId = adminPayload.adminId;
                req.role = adminPayload.role;
                next();
            }
        }
        catch (err) {
            try {
                let superAdminPayload = jwt.verify(authorization, process.env.superAdminSecretKey);

                if (superAdminPayload) {
                    req.adminId = superAdminPayload.adminId;
                    req.role = superAdminPayload.role;
                    next();
                }
            }
            catch (err) {
                try {
                    let superAdminPayload = jwt.verify(authorization, process.env.subAdminSecretKey);

                    if (superAdminPayload) {
                        req.adminId = superAdminPayload.adminId;
                        req.role = superAdminPayload.role;
                        next();
                    }
                }
                catch (err) {
                    res.sendStatus(401);
                }
            }
        }

    }
    else {
        res.sendStatus(401);
    }
}
