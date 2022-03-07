import {System} from "../System";
import {Cpu} from "./Cpu";

export class Hardware {
    id : number;
    name : string;

    // Manually change this to enable/disable debugging info
    debug : boolean = false;

    constructor(newId : number, newName : string) {
      this.id = newId;
      this.name = newName;

    }

    /*
     / Log function
     / Param: custom message
     / Logs current Hardware & related info to console, followed by a message
    */
    public log(msg : string) {

      // if debug is true, display log
      if (this.debug) {
        let timeInMilli : number = new Date().getTime();
        console.log(this.name + " #" + this.id + " | Time {" + timeInMilli + "} | " + msg);

      } else {
        //console.log("DEBUG DENIED FOR: " + this.name);
      }

    }



     /*
     / HexLog function
     / Param: number (input), length (for padding)
     / Return: string
     / Takes in a number, and returns it in Hexadecimal format
    */
    public hexLog(value : number, length : number) : string {
      // Formats value into Base16
      let output : string = value.toString(16);
      // Formats value padding 0s
      output = output.padStart(length, '0');
      // Console desired output
      return output.toUpperCase();

    }

}
