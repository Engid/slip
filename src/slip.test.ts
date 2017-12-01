import {tokenize, parse, parsePrintable, atom, SlipSymbol} from './slip';
import Tokenizer from './tokenizer';

it("tokenizes", () => {
  expect(tokenize("(+ 1 2)"))
    .toEqual([ '(', '+', '1', '2', ')']);
  expect(tokenize('(+ (- 1 2) 3)'))
    .toEqual(['(', '+', '(', '-', '1', '2', ')', '3', ')', ]);
})

it('Tokenizers', () => {
  var tokens = new Tokenizer('*').toTokens()
  var expectation = [{
    type: 'operator',
    value: '*',
    from: 0,
    to: 1,
    line: 1,
    column: 1
  }]
  expect(tokens).toEqual(expectation)
});

it('symbolizes', () => {
  var sym = new SlipSymbol('+')
  expect(sym)
    .toBeInstanceOf(SlipSymbol)
  expect(sym.value)
    .toEqual('+')
})

it('atomizes', () => {
  expect(atom('3'))
  .toEqual(3)
  expect(atom('*').value)
    .toEqual('*')
});

it('parses', () => {
  expect(parse("(begin (define r 10) (* pi (* r r)))"))
    .toEqual(['begin', ['define', 'r', 10], ['*', 'pi', ['*', 'r', 'r']]]);
})