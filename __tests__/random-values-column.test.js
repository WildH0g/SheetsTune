import { makeRandomValuesColumn } from '../src/server/finetuning/random-values-column.js';
import { describe, it, expect } from 'vitest';

describe('makeRandomValuesColumn', () => {
  it('Should add random, "VALIDATE" and "TEST" values in a column', () => {
    const input = [
      ['a'],
      ['b'],
      ['c'],
      ['d'],
      ['e'],
      ['f'],
      ['g'],
      ['h'],
      ['i'],
      ['j'],
    ];
    const output = makeRandomValuesColumn(input.length, [
      { name: 'VALIDATE', count: 3 },
      { name: 'TEST', count: 2 },
    ]);
    expect(output.filter(row => 'VALIDATE' === row[0]).length).toBe(3);
    expect(output.filter(row => 'TEST' === row[0]).length).toBe(2);
    expect(output.filter(row => '' === row[0]).length).toBe(5);
  });
});
