
export class AsciiLib {

// Any index with "_" (besides the O.G. 0x5F) is simply a null space.


public static _ascii : string = "________________________________ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[_]^_'abcdefghijklmnopqrstuvwxyz{|}~_";
        //  "________________"   Indices 00-0F
        //  "________________"   Indices 10-1F
        //  " !\"#$%&'()*+'-./"  Indices 20-2F
        //  "0123456789:;<=>?"   Indices 30-3F
        //  "@ABCDEFGHIJKLMNO"   Indices 40-4F
        //  "PQRSTUVWXYZ[_]^_"   Indices 50-5F
        //  "'abcdefghijklmno"   Indices 60-6F
        //  "pqrstuvwxyz{|}~_"   Indices 70-7F

// How to encode from number: _asciiString.charAt(0x05)
// How to decode from string: _asciiString.indexOf("F")

  /*
  / Encode Function
  / Param: hex number
  / Return: encoded string
  / Takes in a value to encode, and returns the ASCII representation
 */
  public static encode(hex : number) : string {
    // Special Cases
    if (hex == 0x0A) {
      console.log();
      return "";
    } else
    if (hex == 0x5F) {
      return "_";
    } else
    if (hex == 0x5C) {
      // Backslash doesnt work due to string syntax
      return "";
    }
    return AsciiLib._ascii.charAt(hex);
  }

  /*
  / Decode Function
  / Param: ASCII string
  / Return: hex
  / Takes in a string char to decode, and returns the number of its ASCII representation
 */
  public static decode(str : string) : number {
    // Note: All button/control inputs like LF will not work

    // Special Cases
    if (str === "_") {
      return 0x5F;
    }
    return AsciiLib._ascii.indexOf(str);
  }

}
