
/*
/ Public LinkedQueue Class
/ A Queue implementation of a standard LinkedList
/ Classes that import this: Keyboard.ts , InterrControl.ts
*/
export class LinkedQueue {
  head : Node;
  size : number;

  constructor() {
    this.head = null;
    this.size = 0;
  }

  /*
   / Enqueue Function
   / Param: enq (value to add), priority
   / Adds a new element to the back of the Queue
  */
  public enqueue(enq : string, pri : number) : void {
    if (this.size == 0 || pri > this.head.priority) {
      this.head = new Node(enq,pri);
    } else {
      let newNode: Node = this.head;
        while (newNode.next != null) {
          if (pri > newNode.next.priority) {
            newNode.next = new Node(enq,pri)
          } else {
            newNode = newNode.next;
          }
        }
        newNode.next = new Node(enq,pri);
    }
    this.size++;
  }

  /*
   / Dequeue Function
   / Return: Dequeued element
   / Removes the frontmost element from the Queue
  */
  public dequeue() : string {
    if (this.head === null) {
      return "null";
    } else {
      var deq = this.head.value;
      this.head = this.head.next;
      this.size--;
      return deq;
    }
  }

  /*
   / DisplayQueue Function
   / Logs the Queue to the terminal
  */
  public displayQueue() : void {
    if (this.head != null) {
      process.stdout.write("Queue [ ")
      let current = this.head;
      while (current != null) {
        process.stdout.write(current.value + " ");
        current = current.next;
      }
      process.stdout.write("]\n")
    }
  }
}

/*
 / Private Node Class
 / Members: value, priority, next
 / Used as elements in the Queue
*/
class Node {
  value : string;
  priority : number;
  next : Node;

  constructor(value : string, priority : number) {
    this.value = value;
    this.priority = priority;
    this.next = null;
  }
}
