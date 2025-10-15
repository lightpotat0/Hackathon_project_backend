import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    // coletor de token do header
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ message: "Token não enviado"})

    const token = authHeader.split(" ")[1]

    try{
        //validador de token
        const validtok = jwt.verify(token, process.env.JWT_SECRET)
        
        req.user = validtok

        next();
    } catch (err) {
        // Se o token for inválido, retorna 401
        res.status(401).json({ message: "Token invalid"})
    }
}