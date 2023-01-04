const verifyRole = (allowedRole) => {
    return (req, res, next) => {
        if (!req?.role) return res.sendStatus(401);

        console.log(allowedRole);
        console.log(req.role);

        const result = req.role.localeCompare(allowedRole);

        if (!result == 0) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRole