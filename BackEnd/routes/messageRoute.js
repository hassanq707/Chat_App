import  express from 'express';
import  {getSelectedUserMessages,markMessageAsSeen,getUsers,sendMsgToSelectedUser} from '../controllers/messageController.js';
import  { protectedRoute } from '../middleware/auth.js';
const  router = express.Router();

router.get('/users', protectedRoute , getUsers);
router.get('/:id', protectedRoute , getSelectedUserMessages);
router.put('/mark/:id', protectedRoute, markMessageAsSeen);
router.post('/send/:id', protectedRoute, sendMsgToSelectedUser);

export default router;
