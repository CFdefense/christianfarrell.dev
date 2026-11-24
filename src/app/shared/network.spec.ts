import { ALGORITHMS, buildNetwork } from './network';

describe('network algorithms', () => {
  it('has plenty of algorithms with unique names', () => {
    expect(ALGORITHMS.length).toBeGreaterThanOrEqual(20);
    expect(new Set(ALGORITHMS.map((a) => a.name)).size).toBe(ALGORITHMS.length);
  });

  it('builds connected networks that every algorithm fully covers using real edges', () => {
    for (let run = 0; run < 100; run++) {
      const net = buildNetwork();
      expect(net.nodes.length).toBeGreaterThanOrEqual(8);
      const start = Math.floor(Math.random() * net.nodes.length);

      for (const algo of ALGORITHMS) {
        const steps = algo.run(net, start);
        const seen = new Set(steps.map((s) => s.node));
        expect(seen.size, `${algo.name} should visit every node`).toBe(net.nodes.length);
        for (const { node, parent } of steps) {
          if (parent !== null) expect(net.adj[node], `${algo.name} used a non-edge`).toContain(parent);
        }
      }
    }
  });
});
