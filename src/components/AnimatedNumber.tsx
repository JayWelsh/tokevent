import React from 'react';

import AnimatedNumbers from "react-animated-numbers";

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
      </>
    )
};

const MemoAnimatedNumber = React.memo(AnimatedNumber, (prevProps, nextProps) => {
  return prevProps.number === nextProps.number && prevProps.fontSize === nextProps.fontSize;
})

export default MemoAnimatedNumber;