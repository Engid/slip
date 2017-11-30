import {tokenize, parse, atom} from './slip';

it("tokenizes", () => {
  expect(tokenize("(+ 1 2)"))
    .toEqual([ '(', '+', '1', '2', ')']);
  expect(tokenize('(+ (- 1 2) 3)'))
    .toEqual(['(', '+', '(', '-', '1', '2', ')', '3', ')', ]);
})

/*
it('replaces', () => {
  expect( "()".replace('(', ' ( ') )
    .toEqual(" ( )");

  expect( "()".replace(')', ' ) ') )
    .toEqual("( ) ");

  expect( "()".replace('(', ' ( ')
              .replace(')', ' ) ')  )
    .toEqual(" (  ) ");
  
  expect( "())".replace(/\(/g, ' ( ')
              .replace( /\)/g , ' ) ')  )
    .toEqual(" (  )  ) ");
})
*/

it('atomizes', () => {
  expect(atom('3'))
  .toEqual(3)
  expect(atom('*'))
    .toEqual('*')
});

it('parses', () => {
  expect(parse("(begin (define r 10) (* pi (* r r)))"))
    .toEqual(['begin', ['define', 'r', 10], ['*', 'pi', ['*', 'r', 'r']]]);
})