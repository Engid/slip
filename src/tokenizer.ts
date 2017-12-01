/*
    THE FILE HAS BEEN MODIFIED FROM ITS ORIGINAL FORM
    BY NICK GIDEO 2016-2017

    ALL COMMENTS AND CODE IS ATTRIBUTED TO DOUGLAS CROCKFORD
    IN LESS OTHERWISE NOTIFIED (IE: I'll sign with '-Nick', or '-NZG').
    
    To aid in distinguishing my additions, I'll try to use "/*" style
    comments. 
*/



//ORIGINAL AUTHOR CREDITS: 

// tokens.js
// 2010-02-23

// (c) 2006 Douglas Crockford

// Produce an array of simple token objects from a string.
// A simple token object contains these members:
//      type: 'name', 'string', 'number', 'operator'
//      value: string or number value of the token
//      from: index of first character of the token
//      to: index of the last character + 1

// Comments of the // type are ignored.

// Operators are by default single characters. Multicharacter
// operators can be made by supplying a string of prefix and
// suffix characters.
// characters. For example,
//      '<>+-&', '=>&:'
// will match any of these:
//      <=  >>  >>>  <>  >=  +: -: &: &&: &&





class Tokenizer {

    value : string;

    

    constructor(program: string){
        //super(program);
        this.value = program
    }



toTokens(prefix?:string , suffix?:string) {
    var c;                      // The current character.
    var from;                   // The index of the start of the token.
    var i = 0;                  // The index of the current character.
    var line = 1;               /* The line number of the token. -NZG */
    var offset = -1;
    var length = this.value.length;
    var n;                      // The number value.
    var q;                      // The quote character.
    var str;                    // The string value.

    var result = [];            // An array to hold the results.

    var error = function error(message:string, t?:any): void {
        t = t || this;
        t.name = "SyntaxError";
        t.message = message;
        throw t;
    }

    var make = function (type, value) {

    // Make a token object.
        
        return {
            type: type,
            value: value,
            from: from,
            to: i,
            line: line,
            column: from - offset,
        };
    };

    // Begin tokenization. If the source string is empty, return nothing.

    if (!this) {
        return;
    }

    // If prefix and suffix strings are not provided, supply defaults.
    // new default: prefix = '=<>!+-*&|/%^'; suffix = '=<>&|:';
    // old default: prefix = '<>+-&'; suffix = '=>&:';
    if (prefix === undefined || typeof prefix !== 'string') {
        prefix = '=<>!+-*&|/%^';
    }
    if (suffix === undefined || typeof suffix !== 'string') {
        suffix = '=<>&|:';
    }


    // Loop through this text, one character at a time.

    c = this.value.charAt(i);
    while (c) {
        from = i;

    // Ignore whitespace.

        if (c <= ' ') {
            
            /*
                I wished to add line numbers for each token to aid in
                debugging. To do so, we simply count '\n' characters. 
                To get column numbers, we store the index value in the var
                `offset` everytime we find a '\n'. We then subtract the `offset`
                from the starting index of each token, kept in the `from` var
                -NZG
            */
            if(c === '\n' || c === '\r\n'){
                line += 1;
                offset = i; //store index to subtract offset for column -NZG
            }

            i += 1;
            c = this.value.charAt(i);

    // name.

        } else if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) {
            str = c;
            i += 1;
            for (;;) {
                c = this.value.charAt(i);
                if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') ||
                        (c >= '0' && c <= '9') || c === '_') {
                    str += c;
                    i += 1;
                } else {
                    break;
                }
            }
            result.push(make('name', str));

    // number.

    // A number cannot start with a decimal point. It must start with a digit,
    // possibly '0'.

        } else if (c >= '0' && c <= '9') {
            str = c;
            i += 1;

    // Look for more digits.

            for (;;) {
                c = this.value.charAt(i);
                if (c < '0' || c > '9') {
                    break;
                }
                i += 1;
                str += c;
            }

    // Look for a decimal fraction part.

            if (c === '.') {
                i += 1;
                str += c;
                for (;;) {
                    c = this.value.charAt(i);
                    if (c < '0' || c > '9') {
                        break;
                    }
                    i += 1;
                    str += c;
                }
            }

    // Look for an exponent part.

            if (c === 'e' || c === 'E') {
                i += 1;
                str += c;
                c = this.value.charAt(i);
                if (c === '-' || c === '+') {
                    i += 1;
                    str += c;
                    c = this.value.charAt(i);
                }
                if (c < '0' || c > '9') {
                    error("Bad exponent", make('number', str));
                }
                do {
                    i += 1;
                    str += c;
                    c = this.value.charAt(i);
                } while (c >= '0' && c <= '9');
            }

    // Make sure the next character is not a letter.

            if (c >= 'a' && c <= 'z') {
                str += c;
                i += 1;
                error("Bad number", make('number', str));
            }

    // Convert the string value to a number. If it is finite, then it is a good
    // token.

            n = +str;
            if (isFinite(n)) {
                result.push(make('number', n));
            } else {
                error("Bad number", make('number', str));
            }

    // string

        } else if (c === '\'' || c === '"') {
            str = '';
            q = c;
            i += 1;
            for (;;) {
                c = this.value.charAt(i);
                if (c < ' ') {
                    //make('string', str).
                    error(c === '\n' || c === '\r' || c === '' ?
                        "Unterminated string." :
                        "Control character in string.", make('', str));
                }

    // Look for the closing quote.

                if (c === q) {
                    break;
                }

    // Look for escapement.

                if (c === '\\') {
                    i += 1;
                    if (i >= length) {
                        error("Unterminated string", make('string', str));
                    }
                    c = this.value.charAt(i);
                    switch (c) {
                    case 'b':
                        c = '\b';
                        break;
                    case 'f':
                        c = '\f';
                        break;
                    case 'n':
                        c = '\n';
                        break;
                    case 'r':
                        c = '\r';
                        break;
                    case 't':
                        c = '\t';
                        break;
                    case 'u':
                        if (i >= length) {
                            error("Unterminated string", make('string', str));
                        }
                        c = parseInt(this.value.substr(i + 1, 4), 16);
                        if (!isFinite(c) || c < 0) {
                            error("Unterminated string", make('string', str));
                        }
                        c = String.fromCharCode(c);
                        i += 4;
                        break;
                    }
                }
                str += c;
                i += 1;
            }
            i += 1;
            result.push(make('string', str));
            c = this.value.charAt(i);

    // comment.

        } else if (c === '/' && this.value.charAt(i + 1) === '/') {
            i += 1;
            for (;;) {
                c = this.value.charAt(i);
                if (c === '\n' || c === '\r' || c === '') {
                    break;
                }
                i += 1;
            }

    // combining

        } else if (prefix.indexOf(c) >= 0) {
            str = c;
            i += 1;
            while (true) {
                c = this.value.charAt(i);
                if (i >= length || suffix.indexOf(c) < 0) {
                    break;
                }
                str += c;
                i += 1;
            }
            result.push(make('operator', str));

    // single-character operator

        } else {
            i += 1;
            result.push(make('operator', c));
            c = this.value.charAt(i);
        }
    }
    return result;
  }
};

export default Tokenizer;