import  express from 'express';
import  { loginUser, registerUser,checkAuth,updateProfile} from '../controllers/userController.js';
import  { protectedRoute } from '../middleware/auth.js';
const  router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.put('/update-profile', protectedRoute, updateProfile);
router.get('/check' , protectedRoute , checkAuth);

export default router;
