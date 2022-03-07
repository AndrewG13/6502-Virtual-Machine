import {System} from "../System";
import {Hardware} from "./Hardware";
import {MemManUnit} from "./MemManUnit";
import {ClockListener} from "./imp/ClockListener";
import {AsciiLib} from "./library/AsciiLib";
import {InterrControl} from "./InterrControl";

// Enumeration depicting the different commands the CPU can run
enum Commands { FETCH, DECODE, EXECUTE, WRITEBACK, INTERRUPTCHECK }

export class Cpu extends Hardware implements ClockListener {
      // Array of Opcodes (denoting operand quantity)
      //noByteOpcode : number[] = new Array(6); // conceptual
      oneByteOpcode : number[] = new Array(4);
      twoByteOpcode : number[] = new Array(8);

      // CPU-specific members
      cpuCycleCount : number;
      _mmu : MemManUnit = null;
      currentCommand: Commands;
      firstDPhase: boolean;
      firstEPhase: boolean;
      noLog : boolean;

      // Registers & Flags
      accumulator: number;
      xReg: number;
      yReg: number;
      zFlag: boolean;
      instrReg: number;
      progCounter: number;
      overFlow : boolean = false;

    constructor(newId : number, newName : string, systemMMU: MemManUnit) {
      // inherits id and name attributes from Hardware
      super(newId, newName);
      this.cpuCycleCount = 0;
      this.currentCommand = Commands.FETCH; // Starts on Fetch
      this._mmu = systemMMU; // System Memory
      this.accumulator = 0x00; // Meant to hold a VALUE (data)
      this.xReg = 0x00;        // Meant to hold a VALUE (data)
      this.yReg = 0x00;        // Meant to hold a VALUE (data)
      this.zFlag = false;      // Meant to determine comparison outcomes
      this.firstDPhase = true; // Variable to denote Decode phase (prevents 2 different Decode() Methods)
      this.firstEPhase = true; // Variable to denote Execute Phase (only for EE)
      this.instrReg = 0x00;    // Meant to hold a VALUE (instruction)
      this.progCounter = 0x0000; // Meant to hold an ADDRESS (location)
      this.noLog = false; // Specifically reduces logs if FF (for clarity) or InterruptCheck (has its own within function)

      // Arrays to denote Operand-quantity instructions
      // FF is in Two Byte only as it is handled for its other cases (xReg = 1,2)
       //this.noByteOpcode = [0x8A, 0x98, 0xAA, 0xA8, 0xEA, 0x00]; // conceptual
      this.oneByteOpcode = [0xA9, 0xA2, 0xA0, 0xD0];
      this.twoByteOpcode = [0xAD, 0x8D, 0x6D, 0xAE, 0xAC, 0xEC, 0xEE, 0xFF];
    }

   /*
    / Pulse function
    / Sequentially switches between
   */
    pulse(): void {
      // Check to see what Command should proceed each cycle
      // Afterwards, move on to next appropriate Command

      if (this.currentCommand === Commands.FETCH){
        this.fetch();

        // Switch to next Command
        this.currentCommand = Commands.DECODE;
      } else
      if (this.currentCommand === Commands.DECODE){

        // in reverse order just in case 0 operand, unaffectant otherwises
        this.currentCommand = Commands.EXECUTE;
        this.decode();
      } else
      if (this.currentCommand === Commands.EXECUTE){

        // in reverse order just in case Instruction which requires Write Back
        this.currentCommand = Commands.INTERRUPTCHECK;
        this.execute();
      } else
      if (this.currentCommand === Commands.WRITEBACK){
        this.writeBack();

        this.currentCommand = Commands.INTERRUPTCHECK;
      } else { // must be INTERRUPTCHECK

        this.currentCommand = Commands.FETCH;
        this.interruptCheck();
      }

      // DON'T Log status if:
      // * Interrupt phase (handles its own logging)
      // * Debugging is off
      // * IR == 0x00 (useless to do)
      // * IR == 0xFF (makes cleaner ASCII prints)
      if (this.debug && !(this.instrReg == 0x00) && !(this.noLog)) {
          this.statusLog();
      }

      // Resets to default automatically
      this.noLog = false;
      this.cpuCycleCount++;
    }


   /*
   / Fetch function
   / To fetch the instruction at the current Program Counter Address
   / then increment the Program Counter (to move on to the next address)
  */
    fetch(): void {
      if (this.debug) {console.log("Doing Fetch");}

      this._mmu.changeMAR(this.progCounter);
      this._mmu.readFrom();
      this.instrReg = this._mmu.checkMDR();
      this.progCounter++;
    }

    /*
    / Decode function
    / To retrieve memory from the current address in the Program Counter
    / by setting the MAR = PC, and reading from that address (stores data in the MDR)
    /
    / For a Zero Operand Instruction (requires no additional data)
    /     - Skip Decode, go straight to Execute, no PC increment
    / For a One  Operand Instruction (requires one byte of data)
    /     - Increment the Program Counter
    / For a Two  Operand Instruction (requires two bytes of data)
    /     - Increment the Program Counter, recall Decode next cycle
   */
    decode(): void {
      if (this.debug) {console.log("Doing Decode");}
      // Check for Special Case FF
      if (this.instrReg == 0xFF && (this.xReg == 0x01 || this.xReg == 0x02)) {

          if (this.debug){console.log("0 Operand Instruction, SKIP DECODE");}
          this.execute();
      } else  // this.xReg == 0x03
              // It will proceed to the two byte opcode block for FF


      // Check for '2 Operands' Instruction
      if (this.isTwoByteOPCODE()) {
        if (this.firstDPhase){
          // set Little Endian flag
          this._mmu.setLeFlag();
          this._mmu.changeMAR(this.progCounter);
          this._mmu.readFrom();
          this.progCounter++;
          this.firstDPhase = false;
          this.currentCommand = Commands.DECODE;
        } else {
          // retrieve data, setup for Execute
          this._mmu.changeMAR(this.progCounter);
          this._mmu.readFrom();
          this.progCounter++;
          this.firstDPhase = true;
        }
      } else
      // Check for '1 Operand' Instruction
      if (this.isOneByteOPCODE()) {
        // retrieve data, setup for Execute
        this._mmu.changeMAR(this.progCounter);
        this._mmu.readFrom();
        this.progCounter++;
      } else {
      // Must be '0 Operand' Instruction
      // Since the Decode phase does nothing here, call Execute immediately
      if (this.debug){console.log("0 Operand Instruction, SKIP DECODE");}
      this.currentCommand = Commands.INTERRUPTCHECK;
      this.execute();
      }
    }

    /*
    / Execute function
    / To perform the action specified by the Instruction Register
    /
    / Special Case: EE will have two Execute cycles
   */
    execute(): void {
      if (this.debug){console.log("Doing Execute");}
      switch (this.instrReg) {
        case 0xA9: // Load Accu with Constant
          this.accumulator = this._mmu.checkMDR();
          break;
        case 0xAD: // Load Accu with Value from Memory
          this.accumulator = this._mmu.checkMDR();
          break;
        case 0x8D: // Store Memory Register with Accu Value
          this._mmu.changeMDR(this.accumulator);
          this.currentCommand = Commands.WRITEBACK;
          break;
        case 0x8A: // Load Accu with X Register Value
          this.accumulator = this.xReg;
          break;
        case 0x98: // Load Accu with Y Register value
          this.accumulator = this.yReg;
          break;
        case 0x6D: // Add with Carry (Accu += value from Memory Register)
          let acc : number = this.accumulator;
          let mdr : number = this._mmu.checkMDR();

          if (acc >= 0x80) {
            acc -= 0x100;
          }
          if (mdr >= 0x80) {
            mdr -= 0x100;
          }
          acc += mdr;

          // if negative overflow
          if (acc < -128) {
            acc *= -1;
            acc = 0x100 - acc;
            this.overFlow = true;
          } else // if result is negative (valid)
          if (acc < 0) {
            acc *= -1;
            acc = 0x100 - acc;
          } else // if positive overflow
          if (acc >= 0x80) {
            acc -= 0x80;
            this.overFlow = true;
          }

          this.accumulator = acc;
          break;
        case 0xA2: // Load X Register with Constant
          this.xReg = this._mmu.checkMDR();
          break;
        case 0xAE: // Load X Register with value from Memory
          this.xReg = this._mmu.checkMDR();
          break;
        case 0xAA: // Load X Register with Accu value
          this.xReg = this.accumulator;
          break;
        case 0xA0: // Load Y Register with Constant
          this.yReg = this._mmu.checkMDR();
          break;
        case 0xAC: // Load Y Register with value from Memory
          this.yReg = this._mmu.checkMDR();
          break;
        case 0xA8: // Load Y Register with Accu value
          this.yReg = this.accumulator;
          break;
        case 0xEA: // No Operation
          // Did you know that Ducks actually have little teeth?
          // Look it up, I'm serious
          break;
        case 0x00: // Break
            InterrControl.runQueue();
            while (InterrControl.hasInterrupts) {
            console.log("Dequeue -> " + InterrControl.supplyInterrupt());
          }
          process.stdout.write("\nResults:\n");
          this.prettyLog();

          // You can display registers here!
          //this._mmu.displayRegisters(0xABC9, 0xABD1);

          System.stopSystem();
          break;
        case 0xEC: // Compare value from Memory Register to X Register, zFlag = true if equal
          this.zFlag = (this.xReg == this._mmu.checkMDR());
          break;
        case 0xD0: // Branch Constant-bytes if zFlag = false
             // If branch occurs
             if (!this.zFlag) {
               // Calculate how far back the Program Counter needs to go
               let backtrackDifference = 0x100 - (this._mmu.checkMDR());
               // Backtrack the Program Counter based on result (Loop back to desired register)
               this.progCounter -= backtrackDifference;
             }
          break;
        case 0xEE: // Increment value in Memory Register
          if (this.firstEPhase) {
             this.accumulator = this._mmu.checkMDR();
             this.firstEPhase = false;
             this.currentCommand = Commands.EXECUTE;
          } else {
             this.accumulator++;
             if (this.accumulator == 0x100) {
               this.accumulator = 0x00;
               this.overFlow = true;
             }
             this._mmu.changeMDR(this.accumulator);
             this.firstEPhase = true;
             this.currentCommand = Commands.WRITEBACK;
          }
          break;
        case 0xFF: // Multiple Cases
          if (this.xReg == 0x01) {
            process.stdout.write(this.hexLog(this.yReg, 4));
          } else
          if (this.xReg == 0x02) {
            // where in memory = front part of PC & yReg
            // example: PC=1234 yReg=AA, place in memory = 12AA
            let inMemory;
            if (this.progCounter < 0x100) {
              inMemory = this.yReg;
            } else {
              inMemory = ( ((this.progCounter / 0x100) * 0x100) + this.yReg);

            }

            //console.log("PC" + this.progCounter +  ",inMemory" + this.hexLog(inMemory,4));
            this._mmu.changeMAR(inMemory);
            this._mmu.readFrom();

            while (this._mmu.checkMDR() != 0x00) {
              process.stdout.write(AsciiLib.encode(this._mmu.checkMDR()));
              this._mmu.changeMAR((this._mmu.checkMAR()) + 1);
              this._mmu.readFrom();
            }
            // must continuously print until it gets to 00, then terminates

          } else { //this.xReg == 0x03
            while (this._mmu.checkMDR() != 0x00) {
              process.stdout.write(AsciiLib.encode(this._mmu.checkMDR()));
              this._mmu.changeMAR((this._mmu.checkMAR()) + 1);
              this._mmu.readFrom();
            }
          }
            this.currentCommand = Commands.FETCH;
            this.noLog = true;
            break;
      }
    }

    /*
    / Write Back function
    / To write what is in the MDR back into the memory location specified by the MAR
    / Only EE utilizes this function
   */
    writeBack(): void {
      if (this.debug){console.log("Doing Write Back");}
      this._mmu.writeTo();
    }

    /*
    / Interrupt Check function
    / To check if there are any interrupts presented by the user
   */
    interruptCheck(): void {
      if (this.debug){console.log("Doing Interrupt Check");}

      // If interrupts exist, dequeue & halt CPU pipeline while Interrupts still exist
      //    * One interrupt will be dequeued each cycle
      if (InterrControl.hasInterrupts) {
        // Disable Cycle logging for more clear Queue
        this.noLog == true;
        InterrControl.runQueue();

        console.log("Dequeue -> " + InterrControl.supplyInterrupt());
        this.currentCommand = Commands.INTERRUPTCHECK;
      } else {
        // reenable cycle logging
        this.noLog == false;
      }

    }

   /*
   / Status Log function
   / Important Note: The logs are based on the current instructions "after affects"
   / For example, logging Fetch will show the IR with its newly fetched instruction
   /              logging Execute will show the results of the computation
   */
    statusLog(): void {

      this.log("IR:" + this.hexLog(this.instrReg, 2) + "|PC:" + this.hexLog(this.progCounter, 4) +
       "|Accu:" + this.hexLog(this.accumulator, 2) + "|xReg:" + this.hexLog(this.xReg, 2) + "|yReg:" +
        this.hexLog(this.yReg, 2) + "|zFlag:" + this.zFlag + "|MDR:" + this.hexLog(this._mmu.checkMDR(), 2) +
        "|MAR:" + this.hexLog(this._mmu.checkMAR(), 4) + "|Cycle:" + this.cpuCycleCount);
    }

    /*
    / Pretty Log function
    / A more basic, nicer looking Status Log with simpler info presented
   */
    prettyLog(): void {

      console.log("  IR: " + this.hexLog(this.instrReg, 2) + " | PC: " + this.hexLog(this.progCounter, 4) +
       " | Accu: " + this.hexLog(this.accumulator, 2) + "\nXReg: " + this.hexLog(this.xReg, 2) + " | YReg: " + this.hexLog(this.yReg, 2) +
       " | MAR: " + this.hexLog(this._mmu.checkMAR(), 4) + " | MDR: " + this.hexLog(this._mmu.checkMDR(),2) +
       "\nzFlag: " + this.zFlag + " | Overflow: " + this.overFlow + "\nTotal Cycles: " + this.cpuCycleCount);
    }

    /*
    / Is Two Byte Opcode? function
    / Finds out if the current instruction requires 2 Operands (retrievals from memory)
   */
    isTwoByteOPCODE(): boolean {
      for (let i = 0; i < this.twoByteOpcode.length; i++) {
      if (this.instrReg == this.twoByteOpcode[i]) {
        return true;
        }
      }
      return false;
    }

    /*
    / Is One Byte Opcode? function
    / Finds out if the current instruction requires 1 Operand (retrievals from memory)
   */
    isOneByteOPCODE(): boolean {
      for (let i = 0; i < this.oneByteOpcode.length; i++) {
      if (this.instrReg == this.oneByteOpcode[i]) {
        return true;
        }
      }
      return false;
    }

}
