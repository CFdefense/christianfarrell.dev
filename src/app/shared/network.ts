export interface GNode {
  id: number;
  x: number;
  y: number;
}

export interface GEdge {
  a: number;
  b: number;
  key: string;
}

export interface Network {
  nodes: GNode[];
  edges: GEdge[];
  adj: number[][];
  centre: { x: number; y: number };
}

/** One step of a traversal: visit `node`, arriving along the edge from `parent` (null = a jump / new root). */
export interface Step {
  node: number;
  parent: number | null;
}

export interface Algorithm {
  name: string;
  run: (net: Network, start: number) => Step[];
}

type Pt = { x: number; y: number };

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T>(list: T[]): T => list[Math.floor(Math.random() * list.length)];
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const dist = (p: Pt, q: Pt) => Math.hypot(p.x - q.x, p.y - q.y);

export const keyOf = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`);

// ---------------------------------------------------------------------------------------------
// Random networks. Points live in a 400 x 175 box (the SVG viewBox); a generator is chosen at random.
// ---------------------------------------------------------------------------------------------

/** Jittered grid with a few gaps. */
function gridPoints(): Pt[] {
  const pts: Pt[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 7; c++) {
      if (Math.random() < 0.12) continue;
      pts.push({ x: 34 + c * 55.3 + rand(-14, 14), y: 38 + r * 52 + rand(-13, 13) });
    }
  }
  return pts;
}

/** Random scatter with a minimum spacing. */
function scatterPoints(): Pt[] {
  const target = Math.floor(rand(15, 24));
  const pts: Pt[] = [];
  for (let tries = 0; tries < 600 && pts.length < target; tries++) {
    const p = { x: rand(26, 374), y: rand(24, 152) };
    if (pts.every((q) => dist(p, q) >= 40)) pts.push(p);
  }
  return pts;
}

/** A few tight communities spread along the width. */
function clusterPoints(): Pt[] {
  const k = 3 + Math.floor(Math.random() * 2);
  const pts: Pt[] = [];
  for (let i = 0; i < k; i++) {
    const c = { x: 60 + (280 / (k - 1)) * i + rand(-18, 18), y: rand(55, 120) };
    const want = Math.floor(rand(4, 7));
    let placed = 0;
    for (let t = 0; t < 80 && placed < want; t++) {
      const p = { x: clamp(c.x + rand(-36, 36), 24, 376), y: clamp(c.y + rand(-34, 34), 24, 152) };
      if (pts.every((q) => dist(p, q) >= 28)) {
        pts.push(p);
        placed++;
      }
    }
  }
  return pts;
}

/** A hub in the middle with two rings around it. */
function ringPoints(): Pt[] {
  const pts: Pt[] = [{ x: 200 + rand(-8, 8), y: 88 + rand(-6, 6) }];
  const outer = Math.floor(rand(9, 13));
  const inner = Math.floor(rand(4, 7));
  for (let i = 0; i < outer; i++) {
    const a = (i / outer) * Math.PI * 2 + rand(-0.12, 0.12);
    pts.push({ x: 200 + Math.cos(a) * (165 + rand(-8, 8)), y: 88 + Math.sin(a) * (58 + rand(-6, 6)) });
  }
  for (let i = 0; i < inner; i++) {
    const a = (i / inner) * Math.PI * 2 + rand(-0.2, 0.2);
    pts.push({ x: 200 + Math.cos(a) * 75, y: 88 + Math.sin(a) * 28 });
  }
  return pts;
}

const GENERATORS = [gridPoints, scatterPoints, clusterPoints, ringPoints];

/**
 * A fresh random network. People are grown outwards from one random node: each newcomer links to its
 * nearest neighbour already in the network, and sometimes a second one, which creates loops.
 * Node ids follow the order they join, so the network is always connected.
 */
export function buildNetwork(): Network {
  const pts = pick(GENERATORS)();
  const first = pts.splice(Math.floor(Math.random() * pts.length), 1)[0];
  const nodes: GNode[] = [{ id: 0, ...first }];
  const edges: GEdge[] = [];

  while (pts.length) {
    let best = { i: 0, j: 0, d: Infinity };
    pts.forEach((p, i) =>
      nodes.forEach((n, j) => {
        const d = dist(p, n);
        if (d < best.d) best = { i, j, d };
      }),
    );
    const p = pts.splice(best.i, 1)[0];
    const id = nodes.length;
    nodes.push({ id, ...p });
    edges.push({ a: best.j, b: id, key: keyOf(best.j, id) });

    const second = nodes
      .slice(0, id)
      .filter((n) => n.id !== best.j)
      .map((n) => ({ id: n.id, d: dist(n, p) }))
      .sort((m, n) => m.d - n.d)[0];
    if (second && second.d < 80 && Math.random() < 0.6) {
      edges.push({ a: second.id, b: id, key: keyOf(second.id, id) });
    }
  }

  const adj: number[][] = nodes.map(() => []);
  for (const e of edges) {
    adj[e.a].push(e.b);
    adj[e.b].push(e.a);
  }
  const centre = {
    x: nodes.reduce((s, n) => s + n.x, 0) / nodes.length,
    y: nodes.reduce((s, n) => s + n.y, 0) / nodes.length,
  };
  return { nodes, edges, adj, centre };
}

// ---------------------------------------------------------------------------------------------
// Traversal algorithms. Each returns the order nodes are visited in, with the edge used to reach them.
// ---------------------------------------------------------------------------------------------

const w = (net: Network, a: number, b: number) => dist(net.nodes[a], net.nodes[b]);

/** The node furthest from `from`, used as the goal for the heuristic searches. */
function farthest(net: Network, from: number): number {
  return net.nodes.reduce((best, n) => (w(net, from, n.id) > w(net, from, best) ? n.id : best), from);
}

interface Entry {
  node: number;
  parent: number | null;
  g: number; // path length from the start
}

/** Generic frontier search: always expand the entry with the lowest score (ties go to the earliest). */
function bestFirst(net: Network, start: number, score: (e: Entry, seq: number) => number): Step[] {
  const seen = new Set<number>();
  const out: Step[] = [];
  let seq = 0;
  const frontier: (Entry & { key: number })[] = [{ node: start, parent: null, g: 0, key: 0 }];
  while (frontier.length) {
    let bi = 0;
    for (let i = 1; i < frontier.length; i++) if (frontier[i].key < frontier[bi].key) bi = i;
    const cur = frontier.splice(bi, 1)[0];
    if (seen.has(cur.node)) continue;
    seen.add(cur.node);
    out.push({ node: cur.node, parent: cur.parent });
    for (const m of net.adj[cur.node]) {
      if (seen.has(m)) continue;
      const e: Entry = { node: m, parent: cur.node, g: cur.g + w(net, cur.node, m) };
      frontier.push({ ...e, key: score(e, ++seq) });
    }
  }
  return out;
}

function recursiveDfs(net: Network, start: number): Step[] {
  const seen = new Set<number>();
  const out: Step[] = [];
  const visit = (node: number, parent: number | null) => {
    seen.add(node);
    out.push({ node, parent });
    for (const m of net.adj[node]) if (!seen.has(m)) visit(m, node);
  };
  visit(start, null);
  return out;
}

/** Depth-limited DFS with a growing limit; nodes are reported the first time any pass reaches them. */
function iterativeDeepening(net: Network, start: number): Step[] {
  const seen = new Set<number>([start]);
  const out: Step[] = [{ node: start, parent: null }];
  for (let limit = 1; seen.size < net.nodes.length && limit < net.nodes.length; limit++) {
    const shallowest = new Map<number, number>();
    const visit = (node: number, depth: number) => {
      if ((shallowest.get(node) ?? Infinity) <= depth) return;
      shallowest.set(node, depth);
      if (depth === limit) return;
      for (const m of net.adj[node]) {
        if (!seen.has(m)) {
          seen.add(m);
          out.push({ node: m, parent: node });
        }
        visit(m, depth + 1);
      }
    };
    visit(start, 0);
  }
  return out;
}

/** Two BFS waves, one from the start and one from the far side, taking turns until they cover everything. */
function bidirectional(net: Network, start: number): Step[] {
  const seen = new Set<number>();
  const out: Step[] = [];
  const sides: Step[][] = [[{ node: start, parent: null }], [{ node: farthest(net, start), parent: null }]];
  while (sides[0].length || sides[1].length) {
    for (const side of sides) {
      while (side.length) {
        const cur = side.shift()!;
        if (seen.has(cur.node)) continue;
        seen.add(cur.node);
        out.push(cur);
        for (const m of net.adj[cur.node]) if (!seen.has(m)) side.push({ node: m, parent: cur.node });
        break;
      }
    }
  }
  return out;
}

/** Add the shortest edges that do not close a loop; nodes light up as the forest grows. */
function kruskal(net: Network): Step[] {
  const root = net.nodes.map((n) => n.id);
  const find = (i: number): number => (root[i] === i ? i : (root[i] = find(root[i])));
  const seen = new Set<number>();
  const out: Step[] = [];
  for (const e of [...net.edges].sort((x, y) => w(net, x.a, x.b) - w(net, y.a, y.b))) {
    const ra = find(e.a);
    const rb = find(e.b);
    if (ra === rb) continue;
    root[ra] = rb;
    let { a, b } = e;
    if (!seen.has(a) && seen.has(b)) [a, b] = [b, a];
    if (!seen.has(a)) {
      seen.add(a);
      out.push({ node: a, parent: null });
    }
    seen.add(b);
    out.push({ node: b, parent: a });
  }
  return out;
}

/** Wander to a random unvisited neighbour; when boxed in, teleport somewhere new. */
function randomWalk(net: Network, start: number): Step[] {
  const seen = new Set<number>([start]);
  const out: Step[] = [{ node: start, parent: null }];
  let cur = start;
  while (seen.size < net.nodes.length) {
    const fresh = net.adj[cur].filter((m) => !seen.has(m));
    const next = fresh.length ? pick(fresh) : pick(net.nodes.map((n) => n.id).filter((i) => !seen.has(i)));
    out.push({ node: next, parent: fresh.length ? cur : null });
    seen.add(next);
    cur = next;
  }
  return out;
}

/** Always step to the closest unvisited neighbour; when boxed in, jump to the closest unvisited node. */
function nearestNeighbour(net: Network, start: number): Step[] {
  const seen = new Set<number>([start]);
  const out: Step[] = [{ node: start, parent: null }];
  const closest = (from: number, ids: number[]) => ids.reduce((b, i) => (w(net, from, i) < w(net, from, b) ? i : b));
  let cur = start;
  while (seen.size < net.nodes.length) {
    const fresh = net.adj[cur].filter((m) => !seen.has(m));
    const next = fresh.length ? closest(cur, fresh) : closest(cur, net.nodes.map((n) => n.id).filter((i) => !seen.has(i)));
    out.push({ node: next, parent: fresh.length ? cur : null });
    seen.add(next);
    cur = next;
  }
  return out;
}

/** Visit nodes in order of a geometric key, linking each to its closest already-visited neighbour. */
function sweep(net: Network, key: (id: number) => number): Step[] {
  const seen = new Set<number>();
  return net.nodes
    .map((n) => n.id)
    .sort((a, b) => key(a) - key(b))
    .map((node) => {
      const parent = net.adj[node].filter((m) => seen.has(m)).sort((a, b) => w(net, a, node) - w(net, b, node))[0];
      seen.add(node);
      return { node, parent: parent ?? null };
    });
}

/** Real PageRank (damping 0.85); the most influential people are visited first. */
function pageRank(net: Network): Step[] {
  const n = net.nodes.length;
  let rank: number[] = net.nodes.map(() => 1 / n);
  for (let iter = 0; iter < 25; iter++) {
    const prev = rank;
    rank = net.nodes.map((_, i) => 0.15 / n + 0.85 * net.adj[i].reduce((s, j) => s + prev[j] / net.adj[j].length, 0));
  }
  return sweep(net, (i) => -rank[i]);
}

export const ALGORITHMS: Algorithm[] = [
  { name: 'BFS', run: (n, s) => bestFirst(n, s, (_e, q) => q) },
  { name: 'DFS', run: (n, s) => bestFirst(n, s, (_e, q) => -q) },
  { name: 'Recursive DFS', run: recursiveDfs },
  { name: 'Iterative Deepening', run: iterativeDeepening },
  { name: 'Bidirectional BFS', run: bidirectional },
  { name: 'Dijkstra', run: (n, s) => bestFirst(n, s, (e) => e.g) },
  {
    name: 'A*',
    run: (n, s) => {
      const goal = n.nodes[farthest(n, s)];
      return bestFirst(n, s, (e) => e.g + dist(n.nodes[e.node], goal));
    },
  },
  {
    name: 'Greedy Best-First',
    run: (n, s) => {
      const goal = n.nodes[farthest(n, s)];
      return bestFirst(n, s, (e) => dist(n.nodes[e.node], goal));
    },
  },
  { name: 'Prim MST', run: (n, s) => bestFirst(n, s, (e) => (e.parent === null ? 0 : w(n, e.parent, e.node))) },
  { name: 'Kruskal MST', run: kruskal },
  { name: 'Random Walk', run: randomWalk },
  { name: 'Randomised Search', run: (n, s) => bestFirst(n, s, () => Math.random()) },
  { name: 'Highest Degree', run: (n, s) => bestFirst(n, s, (e) => -n.adj[e.node].length) },
  { name: 'Lowest Degree', run: (n, s) => bestFirst(n, s, (e) => n.adj[e.node].length) },
  { name: 'Nearest Neighbour', run: nearestNeighbour },
  { name: 'Sweep Line', run: (n) => sweep(n, (i) => n.nodes[i].x) },
  { name: 'Radial Flood', run: (n, s) => sweep(n, (i) => w(n, s, i)) },
  {
    name: 'Radar Sweep',
    run: (n, s) => {
      const angle = (i: number) => Math.atan2(n.nodes[i].y - n.centre.y, n.nodes[i].x - n.centre.x);
      return sweep(n, (i) => (angle(i) - angle(s) + 4 * Math.PI) % (2 * Math.PI));
    },
  },
  { name: 'Wildfire', run: (n, s) => bestFirst(n, s, (_e, q) => q + Math.random() * 6) },
  { name: 'Random DFS', run: (n, s) => bestFirst(n, s, (_e, q) => -q + Math.random() * 3) },
  { name: 'Gravity Search', run: (n, s) => bestFirst(n, s, (e) => n.nodes[e.node].y) },
  { name: 'Farthest First', run: (n, s) => bestFirst(n, s, (e) => -w(n, s, e.node)) },
  { name: 'PageRank', run: (n) => pageRank(n) },
];
