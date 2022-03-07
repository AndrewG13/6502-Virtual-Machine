import {System} from "../System";
import {Memory} from "./Memory";
import {Cpu} from "./Cpu";
import {Hardware} from "./Hardware";

export class MemManUnit extends Hardware {
  // instance of our Memory (object)
  _mem : Memory = null;

  // Little Endian Flag: Used to indicate when the following 2 DATA inputs will be in LE format
  // Index 0 = Flag
  //           Flag = 0 : No
  //           Flag = 1 : Yes, lob will be stored
  //           Flag = 2 : Yes, hob will be added, full address complete
  // Index 1 = Address (to manipulate)
  private leFlag : number[] = new Array(0x2);

  constructor(newId : number, newName : string, systemMemory : Memory) {
    // inherits id and name attributes from Hardware
    super(newId, newName);

    // passed in instance of the Memory (object)
    this._mem = systemMemory;

    // leFlag defaults at 0
    this.leFlag[0] = 0;
    this.leFlag[1] = 0;
  }

  /*
   / Set Little Endian Flag function
   / Sets the flag accordingly (based on instruction/opcode)
  */
  public setLeFlag() : void {
    this.leFlag[0] = 1; // on, indicating Little Endian
  }

  /*
  / writeImmediate function
  / Param: Register, Data
  / Writes a single byte to memory based on specifications
  / Utilizes MAR & MDR manipulation in one method
  / MAR & MDR will remain untouched after computation
  */
  public writeImmediate(register: number, data : number) : void {
    this.changeMDR(data);
    this.changeMAR(register);
    this.writeTo();


  }

  /*
  / testProgram function
  / Writes a sample program to memory (Regs 0-10)
  */
  public testProgram() : void {

    // Quick Branching Conversion
    // A = Where you want to go back to
    // B = D0 instruction reg# + 2
    // Answer = 100 - (B - A)


  // Hello World (exactly from your IS sheet, XReg = 3)
/*
    this.writeImmediate(0x0000, 0xA2);
    this.writeImmediate(0x0001, 0x03);
    this.writeImmediate(0x0002, 0xFF);
    this.writeImmediate(0x0003, 0x06);
    this.writeImmediate(0x0004, 0x00);
    this.writeImmediate(0x0005, 0x00);
    this.writeImmediate(0x0006, 0x48);
    this.writeImmediate(0x0007, 0x65);
    this.writeImmediate(0x0008, 0x6C);
    this.writeImmediate(0x0009, 0x6C);
    this.writeImmediate(0x000A, 0x6F);
    this.writeImmediate(0x000B, 0x20);
    this.writeImmediate(0x000C, 0x57);
    this.writeImmediate(0x000D, 0x6F);
    this.writeImmediate(0x000E, 0x72);
    this.writeImmediate(0x000F, 0x6C);
    this.writeImmediate(0x0010, 0x64);
    this.writeImmediate(0x0011, 0x21);
    this.writeImmediate(0x0012, 0x0A);
    this.writeImmediate(0x0013, 0x00);
*/


    // Hello World v2, where XReg = 2
/*
    this.writeImmediate(0x0000, 0xA2); // load XReg with 0x02
    this.writeImmediate(0x0001, 0x02);
    this.writeImmediate(0x0002, 0xA9); // Load acc with 0x5F
    this.writeImmediate(0x0003, 0x5F);
    this.writeImmediate(0x0004, 0x8D); // store acc in 0x1234
    this.writeImmediate(0x0005, 0x34);
    this.writeImmediate(0x0006, 0x12);
    this.writeImmediate(0x0007, 0xAC); // load 0x5F into YReg
    this.writeImmediate(0x0008, 0x34);
    this.writeImmediate(0x0009, 0x12);
    this.writeImmediate(0x000A, 0xFF); // Print (upon finish, PC = 000B, YReg = 0x5F, so starts at: 005F)
    this.writeImmediate(0x000B, 0x00); // irrelevant
    this.writeImmediate(0x000C, 0x00); // irrelevant
    // ...
    this.writeImmediate(0x005D, 0x00); // irrelevant
    this.writeImmediate(0x005E, 0x00); // irrelevant
    this.writeImmediate(0x005F, 0x48); // Starts the hello work
    this.writeImmediate(0x0060, 0x65);
    this.writeImmediate(0x0061, 0x6C);
    this.writeImmediate(0x0062, 0x6C);
    this.writeImmediate(0x0063, 0x6F);
    this.writeImmediate(0x0064, 0x20);
    this.writeImmediate(0x0065, 0x57);
    this.writeImmediate(0x0066, 0x6F);
    this.writeImmediate(0x0067, 0x72);
    this.writeImmediate(0x0068, 0x6C);
    this.writeImmediate(0x0069, 0x64);
    this.writeImmediate(0x006A, 0x21);
    this.writeImmediate(0x006B, 0x0A);
    this.writeImmediate(0x006C, 0x00);
*/

    // A-ha Test (DO ITTTT)
/*
    this.writeImmediate(0x0000, 0xA2);
    this.writeImmediate(0x0001, 0x03);
    this.writeImmediate(0x0002, 0xFF);
    this.writeImmediate(0x0003, 0x06);
    this.writeImmediate(0x0004, 0x00);
    this.writeImmediate(0x0005, 0x00);
    this.writeImmediate(0x0006, 0x54);
    this.writeImmediate(0x0007, 0x41);
    this.writeImmediate(0x0008, 0x41);
    this.writeImmediate(0x0009, 0x41);
    this.writeImmediate(0x000A, 0x41);
    this.writeImmediate(0x000B, 0x4B);
    this.writeImmediate(0x000C, 0x4B);
    this.writeImmediate(0x000D, 0x45);
    this.writeImmediate(0x000E, 0x20);
    this.writeImmediate(0x000F, 0x4D);
    this.writeImmediate(0x0010, 0x45);
    this.writeImmediate(0x0011, 0x45);
    this.writeImmediate(0x0012, 0x45);
    this.writeImmediate(0x0013, 0x45);
    this.writeImmediate(0x0014, 0x20);
    this.writeImmediate(0x0015, 0x4F);
    this.writeImmediate(0x0016, 0x4F);
    this.writeImmediate(0x0017, 0x4E);
    this.writeImmediate(0x0018, 0x4E);
    this.writeImmediate(0x0019, 0x4E);
    this.writeImmediate(0x001A, 0x4E);
    this.writeImmediate(0x001B, 0x0A);
    this.writeImmediate(0x001C, 0x0A);
    this.writeImmediate(0x001D, 0x20);
    this.writeImmediate(0x001E, 0x20);
    this.writeImmediate(0x001F, 0x20);
    this.writeImmediate(0x0020, 0x20);
    this.writeImmediate(0x0021, 0x20);
    this.writeImmediate(0x0022, 0x74);
    this.writeImmediate(0x0023, 0x61);
    this.writeImmediate(0x0024, 0x6B);
    this.writeImmediate(0x0025, 0x65);
    this.writeImmediate(0x0026, 0x20);
    this.writeImmediate(0x0027, 0x20);
    this.writeImmediate(0x0028, 0x20);
    this.writeImmediate(0x0029, 0x6F);
    this.writeImmediate(0x002A, 0x6E);
    this.writeImmediate(0x002B, 0x20);
    this.writeImmediate(0x002C, 0x20);
    this.writeImmediate(0x002D, 0x20);
    this.writeImmediate(0x002E, 0x6D);
    this.writeImmediate(0x002F, 0x65);
    this.writeImmediate(0x0030, 0x00);
*/



    // Increment Byte & Branching
    // Register starts at 0x05, increments continuously until = 0x12
    // Definitely lower the clockspeed number with this one


    this.writeImmediate(0x0000, 0xA2);
    this.writeImmediate(0x0001, 0x12);
    this.writeImmediate(0x0002, 0xEE);
    this.writeImmediate(0x0003, 0x40);
    this.writeImmediate(0x0004, 0x10);
    this.writeImmediate(0x0005, 0xEC);
    this.writeImmediate(0x0006, 0x40);
    this.writeImmediate(0x0007, 0x10);
    this.writeImmediate(0x0008, 0xD0);
    this.writeImmediate(0x0009, 0xF8);
    this.writeImmediate(0x000A, 0xAC);
    this.writeImmediate(0x000B, 0x40);
    this.writeImmediate(0x000C, 0x10);
    this.writeImmediate(0x1040, 0x05);





    // Basic Loop from your demos
/*
    this.writeImmediate(0x0000, 0xA9);
    this.writeImmediate(0x0001, 0x05);
    this.writeImmediate(0x0002, 0x8D);
    this.writeImmediate(0x0003, 0x40);
    this.writeImmediate(0x0004, 0x00);
    this.writeImmediate(0x0005, 0xA9);
    this.writeImmediate(0x0006, 0x01);
    this.writeImmediate(0x0007, 0x8D);
    this.writeImmediate(0x0008, 0x41);
    this.writeImmediate(0x0009, 0x00);
    this.writeImmediate(0x000A, 0xA8);
    this.writeImmediate(0x000B, 0xA2);
    this.writeImmediate(0x000C, 0x01);
    this.writeImmediate(0x000D, 0xFF);
    this.writeImmediate(0x000E, 0x6D);
    this.writeImmediate(0x000F, 0x41);
    this.writeImmediate(0x0010, 0x00);
    this.writeImmediate(0x0011, 0xAA);
    this.writeImmediate(0x0012, 0xEC);
    this.writeImmediate(0x0013, 0x40);
    this.writeImmediate(0x0014, 0x00);
    this.writeImmediate(0x0015, 0xD0);
    this.writeImmediate(0x0016, 0xF3);
    this.writeImmediate(0x0017, 0x00);
*/


    // EC test
/*
    this.writeImmediate(0x0000, 0xA2); // Load xReg with 0x55
    this.writeImmediate(0x0001, 0x55);
    this.writeImmediate(0x0002, 0xEC); // Compare to 0x44 (should be false)
    this.writeImmediate(0x0003, 0xCD);
    this.writeImmediate(0x0004, 0xAB);
    this.writeImmediate(0x0005, 0xA2); // Load xReg with 0x44
    this.writeImmediate(0x0006, 0x44);
    this.writeImmediate(0x0007, 0xEC); // Compare to 0x44 (should be true)
    this.writeImmediate(0x0008, 0xCD);
    this.writeImmediate(0x0009, 0xAB);
    this.writeImmediate(0x000A, 0xAE); // Load xReg with 0x11
    this.writeImmediate(0x000B, 0xCE);
    this.writeImmediate(0x000C, 0xAB);
    this.writeImmediate(0x000D, 0xEC); // Compare to 0x44 (should be false)
    this.writeImmediate(0x000E, 0xCD);
    this.writeImmediate(0x000F, 0xAB);
    this.writeImmediate(0xABCD, 0x44);
    this.writeImmediate(0xABCE, 0x11);
*/

    // Powers Program (from your IS programs)
/*
      this.writeImmediate(0x0000, 0xA9);
      this.writeImmediate(0x0001, 0x00);
      this.writeImmediate(0x0002, 0x8D);
      this.writeImmediate(0x0003, 0x40);
      this.writeImmediate(0x0004, 0x00);
      this.writeImmediate(0x0005, 0xA9);
      this.writeImmediate(0x0006, 0x01);
      this.writeImmediate(0x0007, 0x6D);
      this.writeImmediate(0x0008, 0x40);
      this.writeImmediate(0x0009, 0x00);
      this.writeImmediate(0x000A, 0x8D);
      this.writeImmediate(0x000B, 0x40);
      this.writeImmediate(0x000C, 0x00);
      this.writeImmediate(0x000D, 0xAC);
      this.writeImmediate(0x000E, 0x40);
      this.writeImmediate(0x000F, 0x00);
      this.writeImmediate(0x0010, 0xA2);
      this.writeImmediate(0x0011, 0x01);
      this.writeImmediate(0x0012, 0xFF);
      this.writeImmediate(0x0013, 0xA2);
      this.writeImmediate(0x0014, 0x03); // in your Powers Program, I believe this is a typo.  This should be 0x03, its listed as 0x02
      this.writeImmediate(0x0015, 0xFF);
      this.writeImmediate(0x0016, 0x50);
      this.writeImmediate(0x0017, 0x00);
      this.writeImmediate(0x0018, 0xD0);
      this.writeImmediate(0x0019, 0xED);
      this.writeImmediate(0x0050, 0x2C);
      this.writeImmediate(0x0052, 0x00);
*/



    // To test arithmetic (from your examples, easy to change)
    // Right now its set to the last one (-107 + -96 = -203. Overflow:True,Output:0x35)
/*
    this.writeImmediate(0x0000, 0xA9);
    this.writeImmediate(0x0001, 0x95); // Change this
    this.writeImmediate(0x0002, 0x8D);
    this.writeImmediate(0x0003, 0x10);
    this.writeImmediate(0x0004, 0x00);
    this.writeImmediate(0x0005, 0xA9);
    this.writeImmediate(0x0006, 0xA0); // Change this
    this.writeImmediate(0x0007, 0x6D);
    this.writeImmediate(0x0008, 0x10);
    this.writeImmediate(0x0009, 0x00);
    this.writeImmediate(0x000A, 0xA8);
    this.writeImmediate(0x000B, 0xA2);
    this.writeImmediate(0x000C, 0x01);
    this.writeImmediate(0x000D, 0xFF);
    this.writeImmediate(0x000E, 0x00);
*/




    // Verfiy Little Endian functionality
/*
    this.writeImmediate(0x0000, 0xA9); // Load D6 into Accu
    this.writeImmediate(0x0001, 0xD6);
    this.writeImmediate(0x0002, 0xAD); // Load Accu with Value from memory (Value = 12)
    this.writeImmediate(0x0003, 0xCD);
    this.writeImmediate(0x0004, 0xAB);
    this.writeImmediate(0x0005, 0xAA); // Load xReg with Accu value
    this.writeImmediate(0x0006, 0xA8); // Load yReg with Accu value
    this.writeImmediate(0x0007, 0xAE); // Load xReg with value from memory (13)
    this.writeImmediate(0x0008, 0xCE);
    this.writeImmediate(0x0009, 0xAB);
    this.writeImmediate(0x000A, 0xAC); // Load yReg with Value from memory (14)
    this.writeImmediate(0x000B, 0xCC);
    this.writeImmediate(0x000C, 0xAB);
    this.writeImmediate(0x000D, 0xA9); // Load 6D into Accu
    this.writeImmediate(0x000E, 0x6D);
    this.writeImmediate(0xABCD, 0x12); // Memory Addresses containing values
    this.writeImmediate(0xABCE, 0x13);
    this.writeImmediate(0xABCC, 0x14);
*/

    // Big test of Lots of Things
/*
    this.writeImmediate(0x0000, 0xA9); // Load Acc with constant 0x05
    this.writeImmediate(0x0001, 0x05);
    this.writeImmediate(0x0002, 0x8D); // Store Acc (0x05) into Reg:ABCD
    this.writeImmediate(0x0003, 0xCD);
    this.writeImmediate(0x0004, 0xAB);
    this.writeImmediate(0x0005, 0xA2); // Load XReg with constant 0x07
    this.writeImmediate(0x0006, 0x07);
    this.writeImmediate(0x0007, 0xA0); // Load YReg with constant 0x09
    this.writeImmediate(0x0008, 0x09);
    this.writeImmediate(0x0009, 0x8A); // Load Acc with XReg (0x07)
    this.writeImmediate(0x000A, 0x98); // Load Acc with YReg (0x09)
    this.writeImmediate(0x000B, 0xAD); // Load Acc from Reg:ABCD (0x05)
    this.writeImmediate(0x000C, 0xCD);
    this.writeImmediate(0x000D, 0xAB);
    this.writeImmediate(0x000E, 0x6D); // Add with Carry (Acc + 0x0A = 0x0F) Acc now = 0x0F
    this.writeImmediate(0x000F, 0xCF);
    this.writeImmediate(0x0010, 0xAB);
    this.writeImmediate(0x0011, 0xA8); // Load YReg with Acc (0x0F)
    this.writeImmediate(0x0012, 0xAA); // Load XReg with Acc (0x0F)
    this.writeImmediate(0x0013, 0xAC); // Load YReg from Memory (0x05)
    this.writeImmediate(0x0014, 0xCD);
    this.writeImmediate(0x0015, 0xAB);
    this.writeImmediate(0x0016, 0xAE); // Load XReg from Memory (0x05)
    this.writeImmediate(0x0017, 0xCD);
    this.writeImmediate(0x0018, 0xAB);
    this.writeImmediate(0x0019, 0xEE); // Increment ABCF (0x0A = 0x0B)
    this.writeImmediate(0x001A, 0xCF);
    this.writeImmediate(0x001B, 0xAB);
    this.writeImmediate(0x001C, 0xEE); // Increment ABCB (0x0F = 0x10)
    this.writeImmediate(0x001D, 0xCB);
    this.writeImmediate(0x001E, 0xAB);
    this.writeImmediate(0x001F, 0xEC); // Compare XReg with ABCB, FALSE
    this.writeImmediate(0x0020, 0xCB);
    this.writeImmediate(0x0021, 0xAB);
    this.writeImmediate(0x0022, 0xEC); // Compare XReg with ABCD, TRUE
    this.writeImmediate(0x0023, 0xCD);
    this.writeImmediate(0x0024, 0xAB);
    this.writeImmediate(0x0025, 0xA2); // Load XReg with 0x01
    this.writeImmediate(0x0026, 0x01);
    this.writeImmediate(0x0027, 0xFF); // Print YReg, 0x05
    this.writeImmediate(0x0028, 0x00);

    this.writeImmediate(0xABCB, 0x0F);
    this.writeImmediate(0xABCF, 0x0A); // Memory Addresses with Data

    // Copy this code and paste it in CPU.ts, Line: 265 to see results
    //   this._mmu.displayRegisters(0xABC9, 0xABD1);
*/


  }


// *** The proceeding functions represent the management aspect of the MMU  ***
// ***   This is where all the  |        ==> Cpu |  interactions take place ***
//                              | Memory <==     |

/*
/ displayRegisters function
/ Param: start address, end address
/ Synonymous to Memory's displayMemory()
*/
  public displayRegisters(start : number, end : number) {
    this._mem.displayMemory(start, end);
  }

/*
/ reset function
/ Synonymous to Memory's reset()
*/
  public resetMem() : void {
    this._mem.reset();
  }

/*
/ readFrom function
/ Synonymous to Memory's read()
*/
  public readFrom() : void {
    this._mem.read();
    // If MDR contains an instruction that utilizes Little Endian formats
    //  in its next 2 registers/data inputs, set the leFlag = 1

    // Checks for Little Endian Addressing:
    // Check if MDR is a High Order Byte
    if (this.leFlag[0] == 2){
      // Format address based on stored Lob and new Hob
      this.leFlag[1] += (this._mem.getMDR() * 256);
      // Change MAR to appropriate address, reset leFlag
      this._mem.setMAR(this.leFlag[1]);
      // Second read to get the appropriate value into the MDR
      // based on the new (LE) MAR
      this._mem.read();
      // reset flag
      this.leFlag[0] = 0;
      this.leFlag[1] = 0;
    }
    // Check if MDR is a Low Order Byte
    if (this.leFlag[0] == 1) {
      // set address data
      this.leFlag[1] = this._mem.getMDR();
      // set flag to 2 (HOB incoming)
      this.leFlag[0] = 2;
    }
  }

/*
/ writeTo function
/ Synonymous to Memory's write()
*/
  public writeTo() : void {
    this._mem.write();
  }

/*
/ checkMAR function
/ Return: address (from MAR)
/ Synonymous to Memory's getMAR()
*/
  public checkMAR() : number {
    return this._mem.getMAR();
  }

/*
/ checkMDR function
/ Return: data (from MDR)
/ Synonymous to Memory's getMDR()
*/
  public checkMDR() : number {
    return this._mem.getMDR();
  }

/*
/ changeMAR function
/ Param: address (to set MAR)
/ Synonymous to Memory's setMAR()
*/
  public changeMAR(newMar : number) : void {
    this._mem.setMAR(newMar);
  }

/*
/ changeMDR function
/ Param: data (to set MDR)
/ Synonymous to Memory's setMDR()
/ Additional Check if Little Endian is required
*/
  public changeMDR(newMdr : number) : void {
    this._mem.setMDR(newMdr);
  }

}
