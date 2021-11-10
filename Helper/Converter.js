import { PixelRatio } from 'react-native';
import {
    widthPercentageToDP as wp2dp,
    heightPercentageToDP as hp2dp,
  } from 'react-native-responsive-screen';
  
  const designHeight = 667
  const designWidth = 375

  export const wp = dimension => {
    return wp2dp((dimension / designWidth) * 100 + '%');
  };
  
  export const hp = dimension => {
    return hp2dp((dimension / designHeight) * 100 + '%');
  };
  
  export const absolutePx = dimension => {
    let test = dimension*PixelRatio.get()
    console.log(test)
    return test
  };
  