import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator
} from 'react-native'
import {Result} from "../Components/Result.js"


 export const ResultScreen = ({route, navigation}) =>{
    const {pic} = route.params
    const [showProgress, setShowProgress] = useState(true) 
    

    return(
    <View style={styles.container}>
        <ActivityIndicator animating={showProgress} size="large"/>
        <Result pic = {pic} onVisible={() => setShowProgress(false)}/>
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
  