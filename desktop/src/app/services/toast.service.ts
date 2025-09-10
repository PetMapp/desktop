import { Injectable } from '@angular/core';
import { toast } from 'ngx-sonner';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  show(
    title: string,
    description?: string,
    actionLabel?: string,
    actionCallback?: () => void
  ) {
    toast(title, {
      description,
      action: actionLabel
        ? {
            label: actionLabel,
            onClick: () => actionCallback?.(),
          }
        : undefined,
    });
  }
}
