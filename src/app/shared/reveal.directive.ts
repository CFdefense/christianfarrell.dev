import { AfterViewInit, Directive, ElementRef, OnDestroy, inject, input, signal } from '@angular/core';

/**
 * Hides an element until it scrolls into view, then plays the pop-up reveal
 * animation (styles live in styles.scss under `.reveal`).
 *
 * - `revealDelay`: seconds to wait after the element comes into view (use for staggering).
 * - `revealAfterLoad`: extra seconds to wait only when the element is already on screen
 *   at page load, so it follows the hero intro sequence instead of popping in immediately.
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
  host: {
    class: 'reveal',
    '[class.revealed]': 'revealed()',
    '[style.--reveal-delay]': 'delay()',
  },
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  readonly revealDelay = input(0);
  readonly revealAfterLoad = input(0);

  protected readonly revealed = signal(false);
  protected readonly delay = signal('0s');

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;
  private firstCallback = true;

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      this.reveal(0);
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        // The first callback reports the state at page load
        const onScreenAtLoad = this.firstCallback && entry.isIntersecting;
        this.firstCallback = false;
        if (entry.isIntersecting) {
          this.reveal(this.revealDelay() + (onScreenAtLoad ? this.revealAfterLoad() : 0));
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -5% 0px' },
    );
    this.observer.observe(this.el.nativeElement);
  }

  private reveal(delaySeconds: number): void {
    this.delay.set(`${delaySeconds}s`);
    this.revealed.set(true);
    this.observer?.disconnect();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
