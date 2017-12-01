/*
 * Adapted from Peter Norvig's lis.py interpreter
 * found at norgiv.com/lispy.html
 */

//From Crockfords TDOP parser impl


import Tokenizer from './tokenizer'



interface message {
  token: string
  type: string
}

/**
 * Atom =  Number | Symbol | String
 * 
 * NOTE: this is set up to return strings, but
 * string parsing needs to be implemented in 
 * readFromTokens()
 
class Atom {
  constructor(msg: message){
    if (msg.type === 'string'){
      return msg.token;
    }
    else if (msg.type === 'other'){
      let num = new Number(msg.token);
      if (!isNaN(num))
        return num;
      else
        return Symbol(msg.token);
    }
  }
}

*/


/**
 * Norvigs implementation
 */
export function atom(token: string) {
  var num = Number(token);
  if (!isNaN(num))
    return num;
  else
    return new SlipSymbol(token);
}

/**
 * This is to match the use-case for Norvigs Eval,
 * which uses string based 'symbols' as keys for
 * the Env object. ????
 */
export class SlipSymbol extends String {
  value: string;
  constructor(token:string) {
    super();
    this.value = token;
  }
}

//type Atom = number | string;
type List = Array<Atom>;
type Exp = Atom | List;
type Env = Object; 


export function tokenize(chars: string): string[] {
  return chars.replace(/\(/g, ' ( ')
              .replace(/\)/g, ' ) ')
              .split(' ')
              .filter( v => v !== '');
}

export function tokenize2(chars: string): string[] {
  var tokens = [],
    line = 0,
    column = 0,
    wordEnd = 0,
    c = '';

  for(var i = 0; i < chars.length; i++){
    c = chars.charAt(i);
    if(c === ' '){ //case for \t ???
      column = i;
      continue;
    } else if (c === '\n' || c === '\b') {
      column = 0;
      line++;
      continue;
    } else if (c === '(') {
      tokens.push(c);
      column = i;
      continue;
    }

  }

}


export function parse(program: string) {
    return readFromTokens(tokenize(program));
}

export function parsePrintable(program: string){
  var tokens = parse(program);
  function mapper(tokens){ 
    tokens.map((v) => {
      if (Array.isArray(v))
        return mapper(v);
      else if (v instanceof SlipSymbol)
        return v.value;
      else
        return v;
      })
  }
  return mapper(tokens);
}

/**
 * TODO: need to implement string parsing..
 * 
 * @param tokens 
 */
export function readFromTokens(tokens: string[]): Exp {
  if (tokens.length === 0) {
    throw new SyntaxError('Unexpected EOF');
  }

  var token = tokens.shift();

  if (token === undefined) 
    return ''; //This is to appease the type-checker.. better way?
  else if (token === '(') {

    //var L = new Array<Atom>();

    var L = [];
    while (tokens[0] !== ')') 
      L.push(readFromTokens(tokens));
    tokens.shift(); //kicks out ')'
    return L;
  }
  else if (token === ')')
    throw new SyntaxError('Unexpected )');
  else
    return atom(token) 
}

type concat = number | string;

let Env = {
  '+': (a: concat, b: concat) => a + b,
  '-': (a: number, b: number) => a - b,
  '*': (a: number, b: number) => a * b,
  '/': (a: number, b: number) => a / b,
  '>': (a, b) => a > b,
  '<': (a, b) => a < b,
  '>=': (a, b) => a >= b,
  '<=': (a, b) => a <= b,
  '=': (a, b) => a === b,
}

function slipEval(x: Exp, env=Env){
  if (x instanceof SlipSymbol) //Symbols for user defined names
    return env[x.value]
}

function slip () {

  //get program from textbox or cmd line
  //TODO: write getInput();
  var input = getInput();

  try { 
    var program = parse(input) 
  }
  catch(e){
    console.warn(e.message);
    return '';
  }
}



export default slip;