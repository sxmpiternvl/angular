import { animate, style, transition, trigger, query, group } from '@angular/animations';
export const sAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    group([
      query(':leave', [
        style({ opacity: 1 }),
        animate('250ms', style({ opacity: 0 })),
      ], { optional: true }),
      query(':enter', [
        style({ opacity: 0 }),
        animate('250ms', style({ opacity: 1 })),
      ], { optional: true }),
    ]),
  ]),
]);
