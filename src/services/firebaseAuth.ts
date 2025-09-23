import { 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut,
   
} from 'firebase/auth';
import { auth, googleProvider } from '@/config/firebase';

// Google sign in with pop up
export const signInWithGooglePopup=async()=>{
    try{
        const result=await signInWithPopup(auth,googleProvider);
        const user=result.user;
        const token=await user.getIdToken();
        return{
            success:true,
            user:{
                id:user.uid,
                email:user.email,
                name:user.displayName,
                avatar:user.photoURL,
            },
            token,
        }
    }
    catch(error:any){
        console.error('Error during Google sign-in with popup:', error);
        
        // If popup is blocked or COOP policy issue, suggest redirect
        if (error.code === 'auth/popup-blocked' || 
            error.code === 'auth/popup-closed-by-user' ||
            error.message?.includes('Cross-Origin-Opener-Policy')) {
          console.log('Popup blocked or COOP issue, falling back to redirect');
          throw new Error('popup-blocked');
        }
        
        throw new Error(error.code || 'Google sign-in failed');
    }
}

// Google sign in with redirect (alternative for COOP issues)
export const signInWithGoogleRedirect = async () => {
    try {
        await signInWithRedirect(auth, googleProvider);
        // The actual result will be handled by getGoogleRedirectResult
    } catch (error: any) {
        console.error('Error during Google redirect sign-in:', error);
        throw new Error(error.code || 'Google redirect sign-in failed');
    }
}

// Handle redirect result after page reload
export const getGoogleRedirectResult = async () => {
    try {
        const result = await getRedirectResult(auth);
        if (result) {
            const user = result.user;
            const token = await user.getIdToken();
            return {
                success: true,
                user: {
                    id: user.uid,
                    email: user.email,
                    name: user.displayName,
                    avatar: user.photoURL,
                },
                token,
            };
        }
        return { success: false, message: 'No redirect result found' };
    } catch (error: any) {
        console.error('Error getting redirect result:', error);
        throw new Error(error.code || 'Failed to get redirect result');
    }
}

export const signOutFireBase=async()=>{
    try{
        await signOut(auth);

    }
    catch(error:any){
        console.error('Sign out error:', error);
        throw new Error(error.message || 'Sign out failed');

    }
}

