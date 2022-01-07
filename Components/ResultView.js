import { ScanBtn } from "./ScanBtn"
import {View, Text, StyleSheet } from "react-native"
import React, { useRef } from "react";

export const ResultView = ({title, mainView, btnText, onPress}) =>{
    console.log("In FailureVIew")
    return (
        <View style={styles.container}>
            <Text>{title}</Text>
            <ScanBtn text={btnText} onPress={onPress}/>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex:1
    }

})