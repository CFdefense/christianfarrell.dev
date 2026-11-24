import { Component, OnDestroy, OnInit, signal } from '@angular/core';

/** Colour class applied to a line of command output. */
type Tone = 'ok' | 'link' | 'dim' | 'err' | 'info';

/** A line currently shown in the terminal: a typed command or its output. */
interface TerminalLine {
  kind: 'cmd' | 'out';
  text: string;
  tone?: Tone;
}

/** One line of command output. `delay` is the pause (ms) after it appears; `progress` animates a pacman-style bar. */
interface Out {
  text: string;
  tone?: Tone;
  delay?: number;
  progress?: boolean;
}

/** One command in the script, with its output and timing options. */
interface Step {
  cmd: string;
  out?: Out[];
  /** Pause (ms) before the command starts typing. */
  pause?: number;
  /** Type quickly (muscle-memory commands). */
  fast?: boolean;
  /** Clears the screen after typing the command (`clear`). */
  clear?: boolean;
  /** Blows the terminal up once the output has played. */
  crash?: boolean;
}

/** Shorthand for building an output line. */
const o = (text: string, tone?: Tone, delay?: number): Out => ({ text, tone, delay });

// A day in an Arch box. Output lines are kept under ~50 columns so they fit the tilted window.
const SCRIPT: Step[] = [
  {
    cmd: 'fastfetch',
    out: [
      o('christian@arch', 'ok', 60),
      o('--------------', 'dim', 60),
      o('OS: Arch Linux x86_64', 'info', 60),
      o('Kernel: Linux 6.12.4-arch1-1', 'info', 60),
      o('WM: Hyprland (Wayland)', 'info', 60),
      o('Shell: zsh 5.9', 'info', 60),
      o('GPU: NVIDIA GeForce RTX 4090', 'info', 60),
      o('Memory: 6.2 GiB / 62.5 GiB', 'info', 60),
    ],
  },
  {
    cmd: 'nvidia-smi dmon -c 2',
    out: [
      o('# gpu   pwr  gtemp  sm  mem   mclk  pclk', 'dim', 60),
      o('# Idx     W      C   %    %    MHz   MHz', 'dim', 60),
      o('    0    42     47  23   11  10501  2535', undefined, 1000),
      o('    0    44     48  31   11  10501  2535'),
    ],
  },
  { cmd: 'clear', clear: true },
  { cmd: 'sudo pacmna -Syu', out: [o('sudo: pacmna: command not found', 'err')] },
  {
    cmd: 'fuck',
    pause: 900,
    fast: true,
    out: [
      o('sudo pacman -Syu [enter/↑/↓/ctrl+c]', 'dim', 1300),
      o(':: Synchronizing package databases...', 'info'),
      o(' core is up to date'),
      o(' extra is up to date'),
      o(':: Starting full system upgrade...', 'info'),
      o(' there is nothing to do'),
    ],
  },
  {
    cmd: 'sudo pacman -S --needed ripgrep fd bat',
    out: [
      o('resolving dependencies...', 'dim', 120),
      o('looking for conflicting packages...', 'dim', 120),
      o('Packages (3) bat-0.24.0  fd-10.2.0  ripgrep-14.1', undefined, 120),
      o('Total Installed Size:  14.82 MiB', undefined, 120),
      o(':: Proceed with installation? [Y/n] y', 'info', 300),
      { text: '(1/3) installing bat', progress: true },
      { text: '(2/3) installing fd', progress: true },
      { text: '(3/3) installing ripgrep', progress: true },
      o(':: Running post-transaction hooks...', 'info'),
    ],
  },
  { cmd: 'clear', clear: true, fast: true },
  {
    cmd: 'lsblk -o NAME,FSTYPE,SIZE,MOUNTPOINT',
    out: [
      o('NAME        FSTYPE   SIZE MOUNTPOINT', 'dim', 80),
      o('nvme0n1              1.8T', undefined, 80),
      o('├─nvme0n1p1 vfat     512M /boot', undefined, 80),
      o('└─nvme0n1p2 btrfs    1.8T /', undefined, 80),
    ],
  },
  {
    cmd: 'cat /proc/pressure/cpu',
    out: [o('some avg10=0.00 avg60=0.12 avg300=0.08 total=482913')],
  },
  {
    cmd: "sudo bpftrace -e 'kprobe:vfs_read{@=count()}'",
    out: [
      o('Attaching 1 probe...', 'dim', 1400),
      o('^C', undefined, 300),
      o('@: 48213', 'ok'),
    ],
  },
  { cmd: 'clear', clear: true, fast: true },
  {
    cmd: 'cargo build --release',
    out: [
      o('Compiling tokio v1.41.0', 'dim', 160),
      o('Compiling axum v0.7.9', 'dim', 160),
      o('Compiling candle-core v0.8.0', 'dim', 220),
      o('Compiling inference-server v0.3.1', 'dim', 900),
      o('Finished `release` profile in 38.12s', 'ok'),
    ],
  },
  {
    cmd: 'cargo clippy -- -D warnings',
    out: [
      o('warning: redundant clone', 'err', 120),
      o('  --> src/serve.rs:42:21', 'info', 120),
      o('error: could not compile (1 warning)', 'err'),
    ],
  },
  {
    cmd: 'cargo clippy --fix --allow-dirty',
    out: [
      o('Checking inference-server v0.3.1', 'dim', 700),
      o('Fixed src/serve.rs (1 fix)', 'info'),
      o('Finished `dev` profile in 1.32s', 'ok'),
    ],
  },
  {
    cmd: 'cargo test --release',
    out: [
      o('running 24 tests', undefined, 600),
      o('test result: ok. 24 passed; 0 failed', 'ok'),
    ],
  },
  { cmd: 'clear', clear: true, fast: true },
  {
    cmd: 'vllm serve llama-3.1-8b --port 8000',
    out: [
      o('INFO Loading weights took 4.21 s', 'info', 700),
      o('INFO KV cache: 31.4 GiB, 251k tokens', 'info', 160),
      o('INFO Capturing CUDA graphs...', 'dim', 900),
      o('INFO Uvicorn running on :8000', 'ok'),
    ],
  },
  {
    cmd: 'curl -s :8000/v1/models | jq -r .data[].id',
    out: [o('llama-3.1-8b')],
  },
  {
    cmd: 'nvidia-smi --query-gpu=utilization.gpu,memory.used --format=csv,noheader',
    out: [o('87 %, 19842 MiB')],
  },
  { cmd: 'clear', clear: true, fast: true },
  {
    cmd: 'git log --oneline --graph -4',
    out: [
      o('* 3f9c2a1 feat: graph traversal hero', undefined, 120),
      o('* a81d0be feat: terminal panel', undefined, 120),
      o('* 5c77e12 fix: nested scroll container', undefined, 120),
      o('* 0be41d9 init: christianfarrell.dev', undefined, 120),
    ],
  },
  {
    cmd: 'ng serve',
    out: [
      o('✔ Building...', 'ok'),
      o('Application bundle generation complete.', 'ok'),
      o('→ Local:   http://localhost:4200/', 'link'),
    ],
  },
  {
    cmd: 'sudo rm -rf --no-preserve-root /',
    pause: 1200,
    crash: true,
    out: [
      o("removed '/usr/bin/git'", 'dim', 90),
      o("removed '/usr/bin/node'", 'dim', 90),
      o("removed '/usr/lib/libc.so.6'", 'dim', 90),
      o("removed '/usr/bin/zsh'", 'dim', 90),
      o("rm: cannot remove '/proc/1': busy", 'err', 160),
      o('sudo: error while loading shared', 'err', 120),
      o('libraries: libc.so.6: No such file', 'err', 200),
      o('zsh: segmentation fault (core dumped)', 'err', 300),
      o('Kernel panic - not syncing:', 'err', 100),
      o('Attempted to kill init!', 'err', 400),
    ],
  },
];

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Decorative, tilted terminal that plays a long sequence of Arch-flavoured commands in a loop. */
@Component({
  selector: 'app-terminal-panel',
  standalone: true,
  template: `
    <div class="tilt" aria-hidden="true">
      <div class="window" [class.crashed]="crashed()">
        <div class="bar">
          <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
          <span class="title">christian&#64;arch:~</span>
        </div>
        <div class="body">
          @for (line of lines(); track $index; let last = $last) {
            <div class="line">
              @if (line.kind === 'cmd') {
                <span class="user">christian&#64;arch</span><span class="path">:~$ </span><span>{{ line.text }}</span>
              } @else {
                <span [class]="line.tone ?? ''">{{ line.text }}</span>
              }
              @if (last) {
                <span class="cursor"></span>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      position: absolute;
      left: clamp(1rem, 5vw, 7rem);
      top: calc(clamp(0px, 6vh, 5rem) - 5rem);
      width: clamp(300px, 28vw, 480px);
      animation: panel-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) 2s backwards;
    }

    @media (max-width: 1199px) {
      :host {
        display: none;
      }
    }

    @keyframes panel-in {
      from {
        opacity: 0;
        transform: translateX(-48px);
      }
    }

    .tilt {
      position: relative;
      transform: perspective(1400px) rotateY(24deg) rotateX(5deg) rotateZ(-8deg);
      transform-origin: 30% 50%;
    }

    // Soft back shadow: a blurred copy of the window behind it, pushed down
    .tilt::before {
      content: '';
      position: absolute;
      inset: 14% 4% -10%;
      border-radius: 20px;
      background: rgba(24, 24, 27, 0.32);
      filter: blur(30px);
      z-index: -1;
    }

    .window {
      display: flex;
      flex-direction: column;
      aspect-ratio: 1.7; // same box as the graph card so the two line up
      border-radius: 12px;
      overflow: hidden;
      background: #1d1e23;
      box-shadow: 0 40px 60px -20px rgba(24, 24, 27, 0.35), 0 8px 20px -8px rgba(24, 24, 27, 0.3);
      font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
      font-size: clamp(9px, 0.82vw, 12.5px);
      letter-spacing: 0;
      font-weight: 400;
    }

    .bar {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.55em;
      padding: 0.9em 1.1em;
      background: #2a2b31;
    }

    .dot {
      width: 1em;
      height: 1em;
      border-radius: 50%;
    }

    .red { background: #ff5f57; }
    .yellow { background: #febc2e; }
    .green { background: #28c840; }

    .title {
      position: absolute;
      left: 0;
      right: 0;
      text-align: center;
      color: #9a9ba3;
    }

    // Newest line stays at the bottom; older lines scroll off the top like a real terminal
    .body {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      flex: 1;
      min-height: 0;
      padding: 1em 1.2em;
      color: #e6e6ea;
      line-height: 1.65;
      text-align: left; // the hero is centre-aligned
      overflow: hidden;
    }

    // The final rm -rf /: the window shakes and glitches, then the screen dies
    .window.crashed {
      animation: shake 0.8s linear;
    }

    .window.crashed .body {
      animation: blackout 2.4s ease-in forwards;
    }

    @keyframes shake {
      0%, 100% { transform: translate(0, 0); filter: none; }
      10% { transform: translate(-6px, 3px) skewX(4deg); filter: hue-rotate(90deg) saturate(3); }
      25% { transform: translate(5px, -4px) skewX(-5deg); filter: invert(1); }
      40% { transform: translate(-4px, -2px); filter: hue-rotate(200deg); }
      55% { transform: translate(6px, 4px) skewX(3deg); filter: invert(1) saturate(4); }
      70% { transform: translate(-3px, 2px); filter: none; }
      85% { transform: translate(2px, -1px) skewX(-2deg); filter: hue-rotate(40deg); }
    }

    @keyframes blackout {
      0%, 20% { opacity: 1; }
      60% { opacity: 0.5; }
      100% { opacity: 0; }
    }

    .line {
      flex-shrink: 0;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .user { color: #4ade80; font-weight: 600; }
    .path { color: #9a9ba3; }
    .ok { color: #4ade80; }
    .link { color: #7dd3fc; }
    .dim { color: #9a9ba3; }
    .err { color: #f87171; }
    .info { color: #60a5fa; }

    .cursor {
      display: inline-block;
      width: 0.6em;
      height: 1.15em;
      margin-left: 0.15em;
      vertical-align: text-bottom;
      background: #d4d4d8;
      animation: blink 1s steps(1) infinite;
    }

    @keyframes blink {
      50% {
        opacity: 0;
      }
    }
  `,
})
export class TerminalPanel implements OnInit, OnDestroy {
  readonly lines = signal<TerminalLine[]>([]);
  /** True while the `rm -rf /` crash animation plays. */
  readonly crashed = signal(false);
  private alive = true;

  /** Starts the command loop. */
  ngOnInit(): void {
    void this.run();
  }

  /** Stops the loop at its next checkpoint. */
  ngOnDestroy(): void {
    this.alive = false;
  }

  /** Appends a line to the terminal. */
  private push(line: TerminalLine): void {
    this.lines.update((l) => [...l, line]);
  }

  /** Types `cmd` into a new prompt line one character at a time. */
  private async type(cmd: string, fast = false): Promise<void> {
    this.push({ kind: 'cmd', text: '' });
    for (let i = 1; i <= cmd.length && this.alive; i++) {
      this.lines.update((l) => [...l.slice(0, -1), { kind: 'cmd', text: cmd.slice(0, i) }]);
      await sleep(fast ? 35 + Math.random() * 35 : 55 + Math.random() * 50);
    }
  }

  /** Pacman-style progress line: "(1/3) installing bat   [#####-----]  50%". */
  private async progress(label: string): Promise<void> {
    const text = (n: number) => `${label.padEnd(26)}[${'#'.repeat(n)}${'-'.repeat(10 - n)}] ${n * 10}%`;
    this.push({ kind: 'out', text: text(0) });
    for (let n = 1; n <= 10 && this.alive; n++) {
      await sleep(70 + Math.random() * 60);
      this.lines.update((l) => [...l.slice(0, -1), { kind: 'out', text: text(n) }]);
    }
  }

  /** Shakes the window, fades the screen to black, then waits a moment before the loop restarts. */
  private async crash(): Promise<void> {
    this.crashed.set(true);
    await sleep(3000);
    this.crashed.set(false);
    this.lines.set([]);
    await sleep(1200);
  }

  /** Plays the whole script in a loop, ending each pass with the crash. */
  private async run(): Promise<void> {
    await sleep(2400); // start once the panel has slid in, after the experience cards
    while (this.alive) {
      this.lines.set([]);
      for (const step of SCRIPT) {
        if (step.pause) await sleep(step.pause);
        await this.type(step.cmd, step.fast);
        await sleep(350);
        if (step.clear) {
          this.lines.set([]);
          await sleep(300);
          continue;
        }
        for (const out of step.out ?? []) {
          if (!this.alive) return;
          if (out.progress) {
            await this.progress(out.text);
          } else {
            this.push({ kind: 'out', text: out.text, tone: out.tone });
            await sleep(out.delay ?? 200);
          }
        }
        if (step.crash) {
          await this.crash();
          break;
        }
        await sleep(900);
      }
    }
  }
}
