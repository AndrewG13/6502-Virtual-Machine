// import statements for hardware
import {Cpu} from "./hardware/Cpu";
import {Hardware} from "./hardware/Hardware";
import {Memory} from "./hardware/Memory";
import {MemManUnit} from "./hardware/MemManUnit";
import {Clock} from "./hardware/Clock";
import {InterrControl} from "./hardware/InterrControl";
import {Keyboard} from "./hardware/Keyboard";
import {AsciiLib} from "./hardware/library/AsciiLib";

// To Run:
//    Git bash in the starting directory
//    Type: ./c
//    Open Powershell, location in starting directory
//    Type: npm start

// Test programs are in MemManUnit.ts, block/unblock them

 /*
    Constants
 */
// Initialization Parameters for Hardware
// Clock cycle interval
const CLOCK_INTERVAL= 100;              // This is in ms (milliseconds) so 1000 = 1 second, 100 = 1/10 second
                                        // A setting of 100 is equivalent to 10hz, 1 would be 1,000hz or 1khz,
                                        // .001 would be 1,000,000 or 1mhz. Obviously you will want to keep this
                                        // small, I recommend a setting of 100, if you want to slow things down
                                        // make it larger.

 // Variable to initiate repeated clock pulses
 var clockRepeater;

export class System extends Hardware {

    private _CPU : Cpu = null;
    private _MEM : Memory = null;
    private _MMU : MemManUnit = null;
    private _CLK : Clock = null;
    private _KEY : Keyboard = null;

    public running: boolean = false;

    constructor(newId : number, newName : string) {
      // inherits name and id attributes from Hardware
      super(newId, newName);

      // Start the System!
      this.startSystem();

    }

    /*
     / StartSystem Function
     / Return: boolean
     / Start the system (Analogous to pressing the power button and having voltages flow through the components)
     / When power is applied to the system clock, it begins sending pulses to all clock observing hardware
     / components so they can act on each clock cycle.
    */
    public startSystem(): boolean {

      console.log("(') System Starting Up\n");
      // Perform Initializations
      this.intializations();

      // Load Tests
      this.myTests();

      // Perform Repeating Clock Pulses
      this.startClock();

      return true;
    }

    /*
     / StopSystem Function
     / Stops the system
    */
    public static stopSystem(): void {

      System.stopClock();
      console.log("\n(') System Powered Off\n");
      InterrControl.stopDevices();
      process.exit();
    }

    /*
     / myTests Function
     / Runs custom tests
     / I deleted outdated ones :)
    */
    public myTests(): void {
      //console.log("\nTests Begin\n");

      /*
      //console.log(AsciiLib.encode());
      process.stdout.write(AsciiLib.decode(0x41)); // A
      process.stdout.write(AsciiLib.decode(0x62)); // b
      process.stdout.write(AsciiLib.decode(0x63)); // c
      process.stdout.write(AsciiLib.decode(0x0A)); // LF
      process.stdout.write(AsciiLib.decode(0x5B)); // [
      process.stdout.write(AsciiLib.decode(0x2F)); // /
      process.stdout.write(AsciiLib.decode(0x35)); // 5
      process.stdout.write(AsciiLib.decode(0x7E)); // ~
      process.stdout.write(AsciiLib.decode(0x7D)); // }
      */

      // TESTS: Memory & MMU
      this._MMU.testProgram();

      //console.log("\nTests Concluded\n");
    }

    /*
     / Initializations Function
     / Runs initializations of hardware
    */
    public intializations(): void {
      // instantiate all Hardware
      this._MEM = new Memory(0, "RAM");
      this._MMU = new MemManUnit(0, "MMU", this._MEM);
      this._CPU = new Cpu(0, "CPU", this._MMU);
      this._CLK = new Clock(0, "CLK");
      this._KEY = new Keyboard(0, "KEY");

      // Add Keyboard to Interrupt Controller
      InterrControl.addDevice(this._KEY);

      // Initiate Keyboard functionality (like enabling it to work)
      this._KEY.monitorKeys();

      // run logging messages for all current hardware
      this._MEM.log("Initialized | Addressable space : " + 0x10000);
      this._CPU.log("Initialized");
      this._MMU.log("Initialized");
      this._CLK.log("Initialized");
      this.log("Initialized");

      // add specific Hardware to Clock
      this._CLK.addToCLK(this._CPU);
      this._CLK.addToCLK(this._MEM);

      console.log("");
    }

    /*
     / Start Clock Function
     / Triggers the Clock to initiate pulses repeatedly
    */
    public startClock(): void {
      clockRepeater = setInterval(
        () => {this._CLK.initiatePulse();}
        , CLOCK_INTERVAL);
    }

    /*
     / Stop Clock Function
     / Stops the clock from pulsing
    */
    public static stopClock(): void {
      clearInterval(clockRepeater);
    }
}

// instantiate System
let system: System = new System(0, "SYS");
