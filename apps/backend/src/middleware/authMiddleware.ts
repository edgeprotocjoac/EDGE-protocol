import { Request, Response, NextFunction } from 'express';
import { supabase } from '../utils/supabase';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Missing or invalid token format' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Token is empty' });
    }

    // Verify token with Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Invalid or expired session' });
    }

    req.user = user;
    next();
  } catch (err: any) {
    return res.status(401).json({ success: false, error: 'Unauthorized: ' + (err.message || 'Authentication error') });
  }
};
