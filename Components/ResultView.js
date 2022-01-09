import { ScanBtn } from "./ScanBtn"
import {View, Text, StyleSheet } from "react-native"
import React, { useRef } from "react";
import { colors } from "../Assets/colors";
import { hp, wp } from "../Helper/Converter";
import { InfoBox } from "./InfoBox";
import { HelpBtn } from "./HelpBtn";


export const ResultView = ({title, mainView, btnText, onPress}) =>{
    console.log("In FailureVIew")
    return (
        <View style={styles.container}>
            
            <Text style={styles.header}>{title}</Text>
            <InfoBox mainView={mainView} style={styles.infoBox}/>
            <ScanBtn text={btnText} onPress={onPress}/>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:"column",
        
    },

    header:{
        marginBottom:hp(16),
        marginTop: hp(208),
        color: colors.fontWhite,
        fontSize: 34,
    },

    infoBox:{
        
        marginTop: hp(200)
        
        
    }

})