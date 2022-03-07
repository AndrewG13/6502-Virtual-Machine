import {LinkedQueue} from "../library/LinkedQueue";

export interface Interrupt {

// Interrupt Device Properties
iqr : number;
priority : number; // higher = greater
name : string;

// Optional Fields
outputBuffer? : LinkedQueue;
 inputBuffer? : LinkedQueue;

}
