import React, { useEffect, useState } from 'react';

import AnimatedNumbers from "react-animated-numbers";
import { useMobileView } from '../hooks';
import PinIcon from '@mui/icons-material/Pin';

interface IAnimatedNumber {
  number: string
  fontSize: string
}

const AnimatedNumber = (props: IAnimatedNumber) => {

    const { number, fontSize } = props;
    
    return (
      <>
        <AnimatedNumbers
          animateToNumber={Number(number)}
          fontStyle={{ fontSize: fontSize, textAlign: 'center' }}
        ></AnimatedNumbers>
        {/* {number && 
          <AnimatedNumbers
            animateToNumber={Number(number)}
            fontStyle={{ fontSize: fontSize, textAlign: 'center' }}
          ></AnimatedNumbers>
        } */}
        {/* {!number && 
          `?`
        } */}
      </>
    )
};

const MemoAnimatedNumber = React.memo(AnimatedNumber, (prevProps, nextProps) => {
  return prevProps.number === nextProps.number && prevProps.fontSize === nextProps.fontSize;
})

export default MemoAnimatedNumber;