import { ToastOptions } from 'ng2-toastr';

export class ToastrCustomOption extends ToastOptions {
  animate: 'flyRight'; // you can override any options available
  newestOnTop: false;
  showCloseButton: true;

  // defaults
  positionClass: 'toast-bottom-right';
  toastLife: 5000;
  maxShown: 5;
  enableHTML: true;
  dismiss: 'auto';
  messageClass: "";
  titleClass: "";
}