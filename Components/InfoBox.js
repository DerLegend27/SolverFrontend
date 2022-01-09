import { StyleSheet, View } from "react-native"
import React from "react";
import { colors } from "../Assets/colors"
import { hp, wp } from "../Helper/Converter"

export const InfoBox = ({mainView}) =>{
    return( 
    <View style={style.container}>
        {mainView}
    </View>
    )
}

const style=StyleSheet.create({
    container:{
        backgroundColor: colors.fontWhite,
        width: wp(311),
        minHeight: hp(70),
        paddingHorizontal:wp(24),
        paddingVertical: hp(24),
        borderRadius: wp(16)
    }
})