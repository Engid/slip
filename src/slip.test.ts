import {tokenize} from './slip';

it("tokenizes", () => {
  expect(tokenize("(+ 1 2)"))
    .toEqual([ '(', '+', '1', '2', ')']);
  expect(tokenize('(+ (- 1 2) 3)'))
    .toEqual(['(', '+', '(', '-', '1', '2', ')', '3', ')', ]);
})
