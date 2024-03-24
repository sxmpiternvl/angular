import {animate, style, transition, trigger} from "@angular/animations";

export const routeAnimationState = trigger('routeAnimationTrigger', [
  transition(':enter', [
    style({
      opacity: 0,
    }),
    animate(300)
  ]),
  transition(':leave', [
    style({
      opacity: 0,
    }),
    animate(10)
  ])

])
