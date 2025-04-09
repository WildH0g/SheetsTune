import { describe, it, expect } from "vitest";

const add = (a, b) =>  a + b;
describe.skip('Add two numbers', () => {
  it('2 + 3 should be 5', () => {
    expect(add(2, 3)).toBe(5);
  });
});
