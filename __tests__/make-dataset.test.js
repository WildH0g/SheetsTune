import { describe, it, expect } from 'vitest';
import { makeDataset } from '../src/server/finetuning/make-dataset.js';

describe('makeDataset', () => {
  it('Should make a JSONL file out of a 2D array', () => {
    const input = [
      ['user', 'model'],
      ['user one', 'model two'],
      ['user three', 'model four'],
      ['five', 'six six'],
      ['final touch', 'haha'],
    ];
    const expectedOutput = [
      {
        contents: [
          { role: 'user', parts: [{ text: 'user one' }] },
          { role: 'model', parts: [{ text: 'model two' }] },
        ],
      },
      {
        contents: [
          { role: 'user', parts: [{ text: 'user three' }] },
          { role: 'model', parts: [{ text: 'model four' }] },
        ],
      },
      {
        contents: [
          { role: 'user', parts: [{ text: 'five' }] },
          { role: 'model', parts: [{ text: 'six six' }] },
        ],
      },
      {
        contents: [
          { role: 'user', parts: [{ text: 'final touch' }] },
          { role: 'model', parts: [{ text: 'haha' }] },
        ],
      },
    ]
      .map(JSON.stringify)
      .join('\n');

    expect(makeDataset(input)).toEqual(expectedOutput);
  });
});
