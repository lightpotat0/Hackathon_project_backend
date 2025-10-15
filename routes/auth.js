import express from "express";
import bcrypt from "bcrypt";      
import jwt from "jsonwebtoken";
import User from "../models/User.js"; 

const router = express.Router();

// cadastro ____
router.post("/register", async (req, res) => {
    try{
        const { name, email, password, date, telefone} = req.body;

        //verifica email
        const Userexist = await User.findOne({ email });
        if (Userexist) return res.status(400).json({ message: "Esse usuário já existe"});

        const password_am = await bcrypt.hash(password, 10)

        //criando user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, date, telefone });

        await user.save();

        res.status(201).json({ message: "Usuário criado" });
    } catch (err) {
        res.status(500).json({ message: "Erro no server" })
    }
})

//login

router.post("/login", async (req, res) => {
    const {email, password } = req.body; // pega dados da requisição 

    try {
        //busca de usuário
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Usuário não encontrado" });
        
        //compara a senha com a armazenada
        const isvalid = await bcrypt.compare(password, user.password);
        if (!isvalid) return res.status(400).json({ message: "Senha errada" });

        //gerador de token
        const token = jwt.sign(
            { id: user._id, name: user.name }, 
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
    } catch (err){
        res.status(500).json({ message: "Erro no servidor" });
    }
})

export default router;