/*
 * Adapted from Peter Norvig's lis.py interpreter
 * found at norgiv.com/lispy.html
 */


/**
 * Atom =  Number | Symbol
 */
class Atom {
  constructor(token: string){
    let num = new Number(token);
    if (num !== NaN)
      return num;
    else
      return Symbol(token);
  }
}

type List = Array<Atom>;
type Exp = Atom | List;
type Env = Object; 


export function tokenize(chars: string): string[] {
  return chars.split('')
              .filter( v => v !== ' ');
}


export function parse(program: string) {
 return readFromTokens(tokenize(program));
}

export function readFromTokens(tokens: string[]): Exp {
 if (tokens.length === 0) {
   throw new SyntaxError('Unexpected EOF');
 }
 var token = tokens.shift();
 
 if (token === '('){
   var L = new Array<Atom>();
   while (tokens[0] !== ')') 
     L.push(readFromTokens(tokens));
   tokens.shift();
   return L;
 }
 else if (token === ')')
   throw new SyntaxError('Unexpected )');
 else
   return new Atom(token) // direct copy of norvigs code.
   //is atom() a constructor? 
 
}


function slip (programInput) {

}



export default slip;