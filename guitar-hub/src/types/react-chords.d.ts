declare module '@tombatossals/react-chords/lib/Chord' {
    import * as React from 'react';
  
    interface ChordProps {
      chord: {
        positions: string[];
        fingerings: string[][];
        name: string;
      };
      instrument: {
        strings: number;
        fretsOnChord: number;
        name: string;
        keys: string[];
        tunings: { [key: string]: string[] };
      };
      lite: boolean;
    }
  
    const Chord: React.FC<ChordProps>;
  
    export { Chord };
  }
  