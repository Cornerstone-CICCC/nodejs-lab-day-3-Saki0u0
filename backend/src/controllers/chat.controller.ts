import { Request, Response } from 'express';
import { Chat } from '../models/chat.model';

// Get all chats
const getAllChats = async (req: Request, res: Response) => {
  try {
    const chats = await Chat.find().sort({ createdAt: 1 }); // Sort by createdAt field
    res.status(200).json(chats);
    console.log('Past message',chats)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching chats' });
  }
};

// Get student by id
const getChatById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const chat = await Chat.findById(req.params.id)
    res.status(200).json(chat)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Unable to get student by id' })
  }
}

const addChat = async (req:Request,res:Response) => {
  try{
    const { username, message, room } = req.body
    const newChat = await Chat.create(req.body)
  }catch(err){
    console.error(err)
    res.status(500).json({ error:'Unable to add student'})
  }
}


export default {
  getAllChats,
  getChatById,
  addChat,
}