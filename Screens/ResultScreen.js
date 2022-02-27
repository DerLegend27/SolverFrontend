import React, { useEffect, useRef, useState } from "react";
import {
    View,
    StyleSheet,
    ActivityIndicator,
    ImageBackground
} from 'react-native'
import { colors } from "../Assets/colors.js";
import {Result} from "../Components/Result.js"
import {
  widthPercentageToDP as wp2dp,
  heightPercentageToDP as hp2dp,
} from 'react-native-responsive-screen';
import { hp } from "../Helper/Converter.js";


 export const ResultScreen = ({route, navigation}) =>{
    const {pic} = route.params
    const {croppedPic} = route.params
    const [showProgress, setShowProgress] = useState(true) 
    const resultRef = useRef()
    useEffect(() => {
      if(showProgress){
      console.log("Mountin")
      resultRef.current.displayResponseText(croppedPic)
        .then(() => {
            setShowProgress(false)
          
        })
      }
    }) 

   
    console.log("Check: REs")
    return(
    
        <ImageBackground source={{uri:pic}} style={styles.container} blurRadius={10}>
          {showProgress &&
          <View style={styles.progress}>
            <ActivityIndicator animating={showProgress} hidesWhenStopped={true} size="large" color={colors.primaryColor} style={styles.progress}/>
          </View>
          }
          <Result ref={resultRef} navigation={navigation}/>
        </ImageBackground>
    
   );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems:"center",
    },
    progress:{
      flex:1,
      alignItems:"center",
      justifyContent:"center"
     
    }
  });
  