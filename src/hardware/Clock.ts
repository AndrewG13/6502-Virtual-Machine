import {Hardware} from "./Hardware";
import {ClockListener} from "./imp/ClockListener";

export class Clock extends Hardware  {
    // Initialize ClockListeners Array
    CLK_Array : ClockListener[];
    pulseCount : number;

    constructor(newId : number, newName : string) {
      // inherits id and name attributes from Hardware
      super(newId, newName);

      this.CLK_Array = new Array();
      this.pulseCount = 0;
    }

    /*
    / AddToClock function
    / Param: ClockListener
    / Adds a new ClockListener Hardware to the Clock Array
    */
    public addToCLK(newEntry : ClockListener): void {
      this.CLK_Array.push(newEntry);
      //console.log("added to CLK_Array");
    }

    /*
    / InitiatePulse Function
    / Pulses all ClockListeners (makes them run their pulse() method)
   */
    public initiatePulse(): void {
      this.pulseCount++;
      //this.log("Clock Pulse Initiated");
      for(var index = 0; index < this.CLK_Array.length; index++) {
        this.CLK_Array[index].pulse();
      }
    }
}
