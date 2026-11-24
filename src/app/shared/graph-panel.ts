import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ALGORITHMS, GEdge, GNode, Network, buildNetwork, keyOf } from './network';

const BUILD_MS = 240; // pause between new people joining the network
const TRAVERSE_MS = 170;
const SPIN_TICKS = 18; // names the reel flicks past before landing on the winner

interface Strip {
  cur: string;
  prev: string;
  n: number; // changes every tick so the scroll animation restarts
  tick: number; // ms until the next tick; also drives the scroll duration
  final: boolean;
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Decorative, tilted card. A random career network grows node by node, a slot machine picks a random
 * algorithm, the algorithm walks the network, then the whole thing implodes and a new one starts.
 */
@Component({
  selector: 'app-graph-panel',
  standalone: true,
  template: `
    <div class="tilt" aria-hidden="true">
      <div class="card">
        <div class="head">
          <svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2.2"/><circle cx="5" cy="18" r="2.2"/><circle cx="19" cy="18" r="2.2"/><path d="m11 7-4.5 9M13 7l4.5 9M7.5 18h9"/></svg>
          <span class="name">Let's Connect</span>
          <span class="legend"><i class="key on"></i>Visited <i class="key"></i>Pending</span>
        </div>

        <svg class="graph" viewBox="0 0 400 175" [class.imploding]="phase() === 'reset'"
             [style.--cx]="centre().x" [style.--cy]="centre().y">
          @for (e of edges(); track e.key) {
            <line [attr.x1]="nodes()[e.a].x" [attr.y1]="nodes()[e.a].y" [attr.x2]="nodes()[e.b].x" [attr.y2]="nodes()[e.b].y"
                  pathLength="1" class="edge" [class.on]="onEdges().has(e.key)" />
          }
          @for (n of nodes(); track n.id) {
            @if (current() === n.id) {
              <circle [attr.cx]="n.x" [attr.cy]="n.y" r="16" class="pulse" />
            }
            <circle [attr.cx]="n.x" [attr.cy]="n.y" [attr.r]="current() === n.id ? 10 : 7"
                    class="node" [class.on]="visited().has(n.id)" />
          }
          @if (phase() === 'reset') {
            <circle [attr.cx]="centre().x" [attr.cy]="centre().y" r="14" class="burst" />
          }
        </svg>

        <div class="status">
          @if (phase() === 'done') {
            <span class="check">✓</span>
          } @else {
            <span class="live"></span>
          }
          @switch (phase()) {
            @case ('build') { Adding connections… }
            @case ('spin') { Selecting an algorithm… }
            @case ('traverse') { Traversing network… }
            @case ('done') { Network traversed }
            @default { Collapsing network… }
          }
          @if (phase() === 'spin' || phase() === 'traverse' || phase() === 'done') {
            <span class="reel" [class.landed]="phase() !== 'spin'">
              @for (s of [strip()]; track s.n) {
                <span class="strip" [class.final]="s.final" [style.--tick]="s.tick">
                  <span class="reel-item">{{ s.cur }}</span>
                  <span class="reel-item">{{ s.prev }}</span>
                </span>
              }
            </span>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      position: absolute;
      right: clamp(1rem, 5vw, 7rem);
      top: calc(clamp(0px, 6vh, 5rem) - 5rem);
      width: clamp(300px, 28vw, 480px);
      animation: panel-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) 2.2s backwards;
    }

    @media (max-width: 1199px) {
      :host {
        display: none;
      }
    }

    @keyframes panel-in {
      from {
        opacity: 0;
        transform: translateX(48px);
      }
    }

    .tilt {
      position: relative;
      transform: perspective(1400px) rotateY(-24deg) rotateX(5deg) rotateZ(8deg);
      transform-origin: 70% 50%;
    }

    // Soft back shadow: a blurred copy of the panel behind it, pushed down
    .tilt::before {
      content: '';
      position: absolute;
      inset: 14% 4% -10%;
      border-radius: 20px;
      background: rgba(24, 24, 27, 0.32);
      filter: blur(30px);
      z-index: -1;
    }

    .card {
      display: flex;
      flex-direction: column;
      aspect-ratio: 1.7; // same box as the terminal so the two line up
      border-radius: 14px;
      background: linear-gradient(160deg, rgba(255, 255, 255, 0.92), rgba(236, 238, 244, 0.9));
      border: 1px solid rgba(255, 255, 255, 0.8);
      box-shadow: 0 40px 60px -20px rgba(24, 24, 27, 0.25), 0 8px 20px -8px rgba(24, 24, 27, 0.15);
      padding: 0.9rem 1rem 0.8rem;
      font-size: clamp(9px, 0.8vw, 12px);
      letter-spacing: 0;
      font-weight: 500;
      color: #52525b;
    }

    .head {
      display: flex;
      align-items: center;
      gap: 0.7em;
      padding-bottom: 0.8em;
      border-bottom: 1px solid rgba(24, 24, 27, 0.07);
    }

    .icon {
      width: 1.7em;
      height: 1.7em;
      color: #71717a;
    }

    .name {
      color: #27272a;
      font-weight: 600;
      font-size: 1.15em;
    }

    .legend {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 0.4em;
    }

    .key {
      width: 0.7em;
      height: 0.7em;
      border-radius: 50%;
      background: #d4d4d8;
      margin-left: 0.5em;
    }

    .key.on {
      background: #3b82f6;
      margin-left: 0;
    }

    .graph {
      display: block;
      flex: 1;
      min-height: 0;
      width: 100%;
      margin: 0.5em 0 0.2em;
    }

    // New links draw in from the existing node towards the newcomer (pathLength=1 normalises the dash)
    .edge {
      stroke: #cbd0da;
      stroke-width: 1.6;
      stroke-dasharray: 1;
      transition: stroke 0.4s, stroke-width 0.4s;
      animation: edge-in 0.35s ease-out backwards;
    }

    .edge.on {
      stroke: #3b82f6;
      stroke-width: 3;
    }

    .node {
      fill: #a1a1aa;
      transform-box: fill-box;
      transform-origin: center;
      transition: fill 0.4s, r 0.3s;
      animation: node-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
    }

    .node.on {
      fill: #3b82f6;
    }

    .pulse {
      fill: rgba(59, 130, 246, 0.25);
      transform-box: fill-box;
      transform-origin: center;
      animation: pulse 1.1s ease-out infinite;
    }

    // Everything is sucked into the middle of the network, then a flash marks the collapse
    .imploding .edge,
    .imploding .node,
    .imploding .pulse {
      transform-box: view-box;
      transform-origin: calc(var(--cx) * 1px) calc(var(--cy) * 1px);
      animation: implode 0.85s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards;
    }

    .burst {
      fill: rgba(59, 130, 246, 0.4);
      transform-box: fill-box;
      transform-origin: center;
      animation: burst 0.5s ease-out 0.7s both;
    }

    @keyframes edge-in {
      from {
        stroke-dashoffset: 1;
      }
    }

    @keyframes node-in {
      from {
        transform: scale(0);
      }
    }

    @keyframes implode {
      to {
        transform: scale(0);
        opacity: 0;
      }
    }

    @keyframes burst {
      from {
        transform: scale(0);
        opacity: 1;
      }
      to {
        transform: scale(2.4);
        opacity: 0;
      }
    }

    @keyframes pulse {
      from {
        transform: scale(0.5);
        opacity: 1;
      }
      to {
        transform: scale(1.5);
        opacity: 0;
      }
    }

    .status {
      display: flex;
      align-items: center;
      height: 2.2em; // fixed, so the reel appearing never resizes the graph
      gap: 0.6em;
      color: #3f3f46;
    }

    // Slot-machine window, bottom right: names scroll in from the top while spinning, then the winner lands
    .reel {
      display: inline-block;
      margin-left: auto;
      overflow: hidden;
      min-width: 12.5em;
      padding: 0 0.8em;
      height: 1.8em;
      line-height: 1.8em;
      border-radius: 0.5em;
      background: #fff;
      border: 1px solid rgba(24, 24, 27, 0.14);
      box-shadow: inset 0 0.5em 0.5em -0.5em rgba(24, 24, 27, 0.2), inset 0 -0.5em 0.5em -0.5em rgba(24, 24, 27, 0.2);
      color: #27272a;
      font-weight: 600;
    }

    // Two rows: the new name on top, the old one below. Each tick scrolls down from the old name to the
    // new one, taking nearly the whole tick, so the reel looks like it is slowing under friction.
    .strip {
      display: block;
      animation: reel-in calc(var(--tick) * 0.9ms) cubic-bezier(0.2, 0.9, 0.3, 1) backwards;
    }

    // The final tick clicks into place with a small overshoot, like a real reel
    .strip.final {
      animation-timing-function: cubic-bezier(0.34, 1.5, 0.64, 1);
    }

    .reel-item {
      display: block;
      white-space: nowrap;
    }

    .reel:not(.landed) .strip {
      filter: blur(0.4px);
    }

    .reel.landed {
      border-color: #3b82f6;
      color: #1d4ed8;
      animation: land 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes reel-in {
      from {
        transform: translateY(-50%);
      }
    }

    @keyframes land {
      from {
        transform: scale(0.9);
      }
    }

    .live {
      width: 0.6em;
      height: 0.6em;
      border-radius: 50%;
      background: #3b82f6;
      animation: blink 1s ease-in-out infinite;
    }

    .check {
      color: #16a34a;
      font-weight: 700;
    }

    @keyframes blink {
      50% {
        opacity: 0.2;
      }
    }
  `,
})
export class GraphPanel implements OnInit, OnDestroy {
  readonly nodes = signal<GNode[]>([]);
  readonly edges = signal<GEdge[]>([]);
  readonly centre = signal({ x: 200, y: 88 });
  readonly visited = signal<Set<number>>(new Set());
  readonly onEdges = signal<Set<string>>(new Set());
  readonly current = signal(-1);
  readonly phase = signal<'build' | 'spin' | 'traverse' | 'done' | 'reset'>('build');
  readonly strip = signal<Strip>({ cur: '', prev: '', n: 0, tick: 100, final: false });
  private alive = true;
  private lastAlgo = -1;

  /** Starts the build, spin, traverse and reset loop. */
  ngOnInit(): void {
    void this.run();
  }

  /** Stops the loop at its next checkpoint. */
  ngOnDestroy(): void {
    this.alive = false;
  }

  /** Empties the graph before the next network is built. */
  private clear(): void {
    this.nodes.set([]);
    this.edges.set([]);
    this.visited.set(new Set());
    this.onEdges.set(new Set());
    this.current.set(-1);
  }

  /**
   * Slot machine: names scroll past quickly, then each tick takes longer than the last (cubic ease-out),
   * and the final, slowest tick rolls onto the winner and clicks into place.
   */
  private async spin(winner: number): Promise<void> {
    this.phase.set('spin');
    let prev = this.strip().cur;
    for (let k = 0; k <= SPIN_TICKS && this.alive; k++) {
      const final = k === SPIN_TICKS;
      let name = ALGORITHMS[winner].name;
      while (!final && (name === prev || name === ALGORITHMS[winner].name)) {
        name = ALGORITHMS[Math.floor(Math.random() * ALGORITHMS.length)].name;
      }
      const tick = final ? 650 : 45 + 520 * (k / SPIN_TICKS) ** 3;
      this.strip.update((s) => ({ cur: name, prev, n: s.n + 1, tick, final }));
      prev = name;
      await sleep(tick * 0.9); // wait for the scroll to finish before the next one starts
    }
    this.phase.set('traverse');
  }

  /** Adds the network's nodes (and the edges to them) one at a time. */
  private async build(net: Network): Promise<void> {
    this.centre.set(net.centre);
    this.phase.set('build');
    for (const n of net.nodes) {
      await sleep(BUILD_MS);
      if (!this.alive) return;
      this.nodes.update((l) => [...l, n]);
      this.edges.update((l) => [...l, ...net.edges.filter((e) => e.b === n.id)]);
      this.current.set(n.id);
    }
    await sleep(600);
    this.current.set(-1);
  }

  /** Endless loop: build a network, spin for an algorithm, traverse, then implode. */
  private async run(): Promise<void> {
    await sleep(2800); // start once the panel has slid in, after the experience cards
    while (this.alive) {
      const net = buildNetwork();
      await this.build(net);

      let winner: number;
      do {
        winner = Math.floor(Math.random() * ALGORITHMS.length);
      } while (winner === this.lastAlgo);
      this.lastAlgo = winner;
      await this.spin(winner);
      await sleep(400);

      const steps = ALGORITHMS[winner].run(net, Math.floor(Math.random() * net.nodes.length));
      for (const { node, parent } of steps) {
        await sleep(TRAVERSE_MS);
        if (!this.alive) return;
        this.visited.update((v) => new Set(v).add(node));
        this.current.set(node);
        if (parent !== null) this.onEdges.update((s) => new Set(s).add(keyOf(parent, node)));
      }
      this.current.set(-1);
      this.phase.set('done');
      await sleep(1400);

      this.phase.set('reset'); // implode
      await sleep(1250);
      if (!this.alive) return;
      this.clear();
      await sleep(500);
    }
  }
}
