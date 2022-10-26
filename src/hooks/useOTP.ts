import { useEffect, useState, useCallback } from "react";

const useOTP = () => {
  const [otp, setOTP] = useState<string>('000000');
  
  const newOTP = useCallback(() => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    let newOtpRaw = array[0];
    let freshOtp = newOtpRaw.toString().substring((newOtpRaw.toString().length - 6), (newOtpRaw.toString().length));
    // check that all of the numbers have changed, else regenerate until all numbers have changed
    // let newOtpSplit = freshOtp.split('');
    // let oldOtpSplit = otp.split('');
    let hasRepeat = false;
    // let checkIndex = 0;
    // for(let entry of newOtpSplit) {
    //   console.log({checkIndex, oldOtpSplit, newOtpSplit});
    //   if(entry === oldOtpSplit[checkIndex]) {
    //     hasRepeat = true;
    //     break;
    //   }
    //   checkIndex++;
    // }
    if(!hasRepeat) {
      setOTP(freshOtp);
    } else {
      newOTP();
    }
  }, [])

  useEffect(() => {
    newOTP();
  }, [newOTP])

  return {
    otp,
    newOTP
  };
}

export default useOTP;