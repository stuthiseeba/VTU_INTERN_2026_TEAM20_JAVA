import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
import { sendMail } from '../utils/sendMail.js';

export const registerUser = async (req,res) => {
  const {name,email,password,role} = req.body;

  const hashedPassword = await bcrypt.hash(password,10);

  await db.query("INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)", 
  [name,email,hashedPassword,role]);

  return res.json({msg: "User registered"});
};

export const loginUser = async (req,res) => {
  const {email,password} = req.body;

  const [rows] = await db.query("SELECT * FROM users WHERE email=?", [email]);
  if (!rows.length) return res.status(400).json({msg:"User not found"});

  const user = rows[0];
  const match = await bcrypt.compare(password,user.password);
  if (!match) return res.status(400).json({msg:"Wrong password"});

  const token = jwt.sign(
    {id:user.id, role:user.role},
    process.env.JWT_SECRET,
    {expiresIn: "1d"}
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified
    }
  });
};

export const getUserProfile = async (req,res) => {
  const [rows] = await db.query("SELECT id,name,email,role,isVerified FROM users WHERE id=?", [req.user.id]);
  res.json(rows[0]);
};

export const requestPasswordReset = async (req,res) => {
  const {email} = req.body;
  const token = Math.random().toString(36).slice(2);
  const expiry = Date.now() + 15 * 60 * 1000;

  await db.query("UPDATE users SET resetToken=?, resetTokenExpiry=? WHERE email=?",
  [token,expiry,email]);

  await sendMail(email, `Your reset link: http://localhost:5173/reset/${token}`);

  res.json({msg:"Reset email sent"});
};

export const resetPassword = async (req,res) => {
  const {token} = req.params;
  const {newPassword} = req.body;

  const [rows] = await db.query("SELECT * FROM users WHERE resetToken=?", [token]);
  if (!rows.length) return res.status(400).json({msg:"Invalid token"});

  if (rows[0].resetTokenExpiry < Date.now())
     return res.status(400).json({msg:"Token expired"});

  const hashed = await bcrypt.hash(newPassword,10);

  await db.query("UPDATE users SET password=?, resetToken=NULL, resetTokenExpiry=NULL WHERE id=?",
  [hashed,rows[0].id]);

  res.json({msg:"Password updated"});
};
