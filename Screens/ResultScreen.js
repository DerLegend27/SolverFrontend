import React, { useEffect, useRef, useState } from "react";
import {
    View,
    StyleSheet,
    ActivityIndicator
} from 'react-native'
import { colors } from "../Assets/colors.js";
import {Result} from "../Components/Result.js"


 export const ResultScreen = ({route, navigation}) =>{
    const {pic} = route.params
    const [showProgress, setShowProgress] = useState(true) 
    const resultRef = useRef()
    useEffect(() => {
      let mounted = true
      resultRef.current.displayResponseText(pic)
        .then(() => {
          if(mounted) {
            setShowProgress(false)
          }

      return () => {
        mounted = false
      }   
        })
    })

    return(
    <View style={styles.container}>
        <ActivityIndicator animating={showProgress} size="large" color={colors.primaryColor}/>
        <Result ref={resultRef} navigation={navigation}/>
    </View>
   );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }
   
  });
  