import {System} from "../System";
import {Hardware} from "./Hardware";
import {Interrupt} from "./imp/Interrupt";
import {LinkedQueue} from "./library/LinkedQueue";

export class InterrControl extends Hardware {

  static hasInterrupts : boolean = false;

  // Array to hold all Interupt Devices
  static interr_Array : Interrupt[] = new Array(0x05);
  static size : number = 0;

  // Queue to hold all interrupts
  static genInputs : LinkedQueue = new LinkedQueue();

  /*
   / Add Device function
   / Param: newDevice (Interrupt-driven I/O)
   / Adds a new device to the Interrupt Controller
  */
  public static addDevice(newDevice : Interrupt) : void {
      // Check if interrupt array is full
      if (InterrControl.size <= 4) {
        InterrControl.interr_Array[InterrControl.size] = newDevice;
        InterrControl.size++;
      } else {
        //console.log("Max Devices!");
      }
  }

  /*
   / Stop Devices function
   / Removes all devices from the Interrupt Controller (sets to null)
  */
  public static stopDevices() {
    for (let i = 0; i < InterrControl.size && InterrControl.interr_Array[i] != null; i++) {
    InterrControl.interr_Array[i] = null;
    }
  }

  /*
   / Accept Interrupt function
   / Param: key (inputted by user)
   / Adds a new key (interrupt 'item') to the Interrupt Controller's 'Generated Inputs' Queue
  */
  public static acceptInterrupt(key : string, pri : number) : void {
    InterrControl.hasInterrupts = true;
    InterrControl.genInputs.enqueue(key,pri);
  }

  /*
   / Run Queue function
   / Displays the Generated Inputs Queue
  */
  public static runQueue() {
    if (InterrControl.hasInterrupts) {
      InterrControl.genInputs.displayQueue();
    }
  }

  /*
   / Supply Interrupt function
   / Return: output (item from the Queue)
   / Dequeues from the Queue and returns it to the CPU
  */
  public static supplyInterrupt() : string {
    var output = InterrControl.genInputs.dequeue();

    if (InterrControl.genInputs.size == 0) {
      InterrControl.hasInterrupts = false;
    }
    return output;
  }
}
