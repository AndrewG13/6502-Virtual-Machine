import {System} from "../System";
import {Hardware} from "./Hardware";
import {InterrControl} from "./InterrControl";
import {Interrupt} from "./imp/Interrupt";
import {LinkedQueue} from "./library/LinkedQueue";

export class Keyboard extends Hardware implements Interrupt {

  iqr : number;
  priority : number; // higher = greater
  name : string;
  outputBuffer : LinkedQueue;

  constructor(newId : number, newNumber : string) {
    super(newId, newNumber);
    this.debug = true; // for responsive "key pressed" logs
    this.iqr = 1;
    this.priority = 5; // Interrupt Controller stores up to 5 devices, therefore 5 would be highest
    this.name = "User Keyboard";
    this.outputBuffer = new LinkedQueue();
  }

  /*
  character stream from stdin code (most of the contents of this function) taken from here
  https://stackoverflow.com/questions/5006821/nodejs-how-to-read-keystrokes-from-stdin

  This takes care of the simulation we need to do to capture stdin from the console and retrieve the character.
  Then we can put it in the buffer and trigger the interrupt.
   */
   public monitorKeys() {

        var stdin = process.stdin;

        // without this, we would only get streams once enter is pressed
        stdin.setRawMode( true );

        // resume stdin in the parent process (node app won't quit all by itself
        // unless an error or process.exit() happens)
        stdin.resume();

        // i don't want binary, do you?
        //stdin.setEncoding( 'utf8' );
        stdin.setEncoding(null);


        stdin.on( 'data', function( key ){
            //let keyPressed : String = key.charCodeAt(0).toString(2);
            //while(keyPressed.length < 8) keyPressed = "0" + keyPressed;
            let keyPressed: string = key.toString();

            this.log("Key pressed - " + keyPressed);

            // ctrl-c ( end of text )
            // this let's us break out with ctrl-c
            if ( key.toString() === '\u0003' ) {
                process.exit();
            }

            // write the key to stdout all normal like
            //process.stdout.write( key);
            // put the key value in the buffer
            // 5 = Keyboard Priority
            this.outputBuffer.enqueue(keyPressed, this.priority);

            // set the interrupt!
            InterrControl.acceptInterrupt(keyPressed, this.priority);

            // .bind(this) is required when running an asynchronous process in node that wishes to reference an
            // instance of an object.
        }.bind(this));
    }

  }
