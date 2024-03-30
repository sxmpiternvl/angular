import { animate, style, transition, trigger, query, group } from '@angular/animations';

export const sAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    group([
      query(':leave', [
        animate('0.6s', style({ opacity: 0 })),
      ],),
      query(':enter', [
        style({ opacity: 0 }),
        animate('0.6s', style({ opacity: 1 })),
      ],),
    ]),
  ]),
]);
