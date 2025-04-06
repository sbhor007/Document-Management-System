import { CanActivateFn } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const token = sessionStorage.getItem('token')
  if(token)
    return true;
  else
    return false
};
