# Andrew Giardina
# 6502-Virtual-Machine
This project is a virtual 6502 processor written in TypeScript and running on Node.js. Check out the 6502 Instruction Set in the Resources folder for OP Code & Assembly instruction details.  

This project is the practical component of Prof. Gormanly's Computer Organization and Architecture class.  This project strives to accomplish the following goals:
- A deep understanding of how the machine works. There is no better way to learn how computers actually work than to build one!
- You become a high level master of code by using OOP to create a virtual machine
- You become a low level ninja, creating programs in machine instructions to run on your creation! Enriching your understanding of the world below your compiler.
- Your design and debugging skills are pushed to solve problems that will melt your brain.  You will debug machine level code you write on a machine you built!

## Credits
This software is an adaptation of a project created by [Dr. Alan Labouseur's](http://labouseur.com/courses/os/) for his Operating Systems (CMPT 424) course project.  That project builds a very cool operating system on top of a rudimentary virtual 6502 CPU.  This project focuses on building a robust and complete 6502 architecture and instruction set.  You will be creating a 6502 emulator programmed using TypeScript that will run on server side JavaScript in Node.js.  Here are references to Dr. Labouseur's original projects:
- 2019 version: https://github.com/AlanClasses/TSOS-2019
- 2015-2018 version: https://github.com/AlanClasses/TSOS

There are plans to possibly expand this project in a way that would allow you to continue to use it to build an adapted version of Dr. Labouseur's OS project on top of.  Here is an architecture diagram showing how this is planned currently.
![tsiram-6502](./resources/images/architecture/projectArchitecture-v1.jpeg)

## Getting Started

To setup a development environment for tsiraM, you will need the following installed and setup:
 - A terminal (If you are on windows I recommend gitbash which can be installed as part of your windows git client installation.
 - Node.js / npm
 - TypeScript (via npm)
 - A text editor / IDE (I recommend VS Code or Intellij if you are getting started with TypeScript)

If you already have Node.js and TypeScript installed you can skip ahead to the 'How to run' section below.

## Installation
### Node:
**Mac**
1. Recommend installation with homebrew: `brew install node`
2. You can use the following to download and run a pkg file:

`curl "https://nodejs.org/dist/latest/node-${VERSION:-$(wget -qO- https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\.pkg</a>.*|\1|p')}.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"`

**Windows:** There is a installer to download from Node.js website

Node getting started: https://nodejs.org/en/docs/guides/getting-started-guide/

I particularly like this resource as well: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/development_environment

### TypeScript:
Documentation: https://www.typescriptlang.org/docs/home.html

Installing TypeScript: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
`npm install -g typescript`

## How to run
It is highly recommended to run this project in Visual Studio Code, using a Bash terminal within.  

- First run `npm install`  
To install node dependencies.

- Next run `./c`  
TypeScript must be compiled before you can run and after you make changes to TypeScript (.ts) files. You may need to add execute permission to the file before you can run. Once you run it, you should see that a dist/ folder is created in your project home and it contains the JavaScript that your Node.js server will run.

- Finally run `npm start`  
To start the Node server. Holding CTRL + C will stop the program.

If you want to make changes to the code (see Testing & Interaction), you will have to recompile using the './c' bash script before executing 'npm start' to run Node.

## Testing & Interaction
Important Notes:  
Changes should only be made in the **src** folder.  
Any changes made must be recompiled by running `./c`.  
Only one 6502 program can be executed at a time.  

- To turn on Debug Mode:  
Navigate to Hardware.ts (src/hardware/Hardware.ts)  
Line 9: Change boolean to true.  

- To change the 6502 program that will run:  
Navigate to MemManUnit.ts (src/hardware/MemManUnit.ts)  
Line 57-379: Contains the testProgram Function.  
Block out the current program, that is, the sequence of *this.writeImmediates()*.  
Unblock a new program in the same fashion.  

Remember to recompile!

### @types/node
Type definitions to be used for Node.js. This should be installed when you run `npm install` to install dependencies. 
See : https://www.npmjs.com/package/@types/node
If they are not installed you can manually do so this way:
`npm install @types/node --save-dev`
