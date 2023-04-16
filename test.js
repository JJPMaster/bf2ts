import * as brainfuck from "./node_modules/brainfuck/lib/brainfuck.js";
var source      = '>+++++++++[<++++++++>-]<.>+++++++[<++++>-]<+.+++++++..+++.[-]'
                + '>++++++++[<++++>-]<.>+++++++++++[<++++++++>-]<-.--------.+++'
                + '.------.--------.[-]>++++++++[<++++>-]<+.';

brainfuck.exec(source, function(err, output) {
    if (err) { throw err };

    console.log(output);
});