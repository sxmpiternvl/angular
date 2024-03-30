import { animate, style, transition, trigger, query, group } from '@angular/animations';

export const sAnimation = trigger('routeAnimations', [

  transition('* <=> *', [
    group([
      query(':leave', [
        animate('1s', style({ opacity: 0 })),
      ], { optional: true }),
      query(':enter', [
        style({ opacity: 0 }),
        animate('1s', style({ opacity: 1 })),
      ], { optional: true }),
    ]),
  ]),
]);
