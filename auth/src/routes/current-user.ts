import express from 'express';
 
import { currentUser } from '@wtytickets/common'

const router = express.Router();

router.get('/api/user/currentuser',currentUser,(req,res)=>{

    return res.send({currentUser:req.currentUser || null})

})

export { router as currentUserRouter }