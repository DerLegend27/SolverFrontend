import { TouchableOpacity, StyleSheet, Image } from "react-native"
import { wp, hp, absolutePx } from '../Helper/Converter'
import { colors } from "../Assets/colors"
import React, { useRef } from "react";

export const HelpBtn = ({ text, onPress }) => {
    return (
    <TouchableOpacity style={style.menuBtn}>
        <Image style={style.menuImg} source={require("../Assets/Images/help.png")} />
    </TouchableOpacity>
    )
}

const style = StyleSheet.create({
    
    menuImg: {
        width: wp(32),
        height: hp(32)
    },
    flashImg: {
        width: wp(32),
        height: hp(32),
        marginRight: wp(16)
    },
    menuBtn: {
        flex: -1,

    }
})