import {System} from "../System";
import {Hardware} from "./Hardware";
import {ClockListener} from "./imp/ClockListener";

export class Memory extends Hardware implements ClockListener {

  // The Hex Number array, size = 65,536 decimal (Addressable Memory)
  // This array will store 2 Hex digits = 1 Byte
  private memoryAddress : number[] = new Array(0x10000);

  // Memory Data Register: the value stored here is in the form of some DATA (a tangible VALUE)
  private mdr: number = 0x00;

  // Memory Addr Register: the value stored here is in the form of an ADDRESS (a representation of a LOCATION)
  private mar: number = 0x0000;

  constructor(newId : number, newName : string) {
    super(newId, newName);

    // Initialize Memory Address values
    this.genArray();
  }

/*
/ GenerateArray function
/ Initializes all values in the array set to 0x00
*/
public genArray() {
  // index for interation
  var index : number = 0x00;
  // Sets all elements = 0x00
  while(index < this.memoryAddress.length) {
    this.memoryAddress[index] = 0x00;
    index = index + 0x01;
  }
}

/*
/ DisplayMemory function
/ Param: starting address, ending address
/ Displays memory addresses from specified limit, Hex formatted
/ If either parameters are invalid, an error log will print
*/
public displayMemory(start : number, end : number) {

  if (start >= this.memoryAddress.length || start < 0 || end >= this.memoryAddress.length || end < start) {
    console.log(this.name + " #" + this.id + " - Address Range [" + (this.hexLog(start, 4)) + " → " + (this.hexLog(end, 4)) + "] Invalid")
  } else {
  while(start < this.memoryAddress.length && start <= end) {
    console.log(this.name + " #" + this.id + " - Address[" + (this.hexLog(start, 4)) + "]  Value " + (this.hexLog(this.memoryAddress[start], 2)));
    start = start + 0x01;
        }
  }
  console.log("");
}

/*
/ Pulse function
/ Used to log out pulses recieved
*/
pulse(): void {
  //this.log("recieved clock pulse");
}

/*
/ Reset function
/ Resets all registers (including MDR & MAR) to their initial state: 0
*/
reset(): void {
  this.genArray();
  this.mdr = 0x00;
  this.mar = 0x0000;
}

/*
/ Read function
/ Take the value in the register specified by the MAR, and store it in the MDR
*/
read(): void {
  this.mdr = this.memoryAddress[this.mar];
}

/*
/ Write function
/ Take the value in the MDR, and store it in the register specified by the MAR
*/
write(): void {
  this.memoryAddress[this.mar] = this.mdr;
}

/*
/ getMDR function
/ Return: MDR (value)
*/
public getMDR(): number {
  return this.mdr;
}

/*
/ getMAR function
/ Return: MAR (address)
*/
public getMAR(): number {
  return this.mar;
}

/*
/ setMDR function
/ Param: newMDR (value)
/ Updates the MDR as specified
*/
public setMDR(newMDR : number): void {
  this.mdr = newMDR;
}

/*
/ setMAR function
/ Param: newMAR (address)
/ Updates the MAR as specified
*/
public setMAR(newMAR : number): void {
  this.mar = newMAR;
}

}
