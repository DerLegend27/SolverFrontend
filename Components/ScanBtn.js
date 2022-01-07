import { TouchableOpacity, StyleSheet, Text } from "react-native"
import { wp, hp, absolutePx } from '../Helper/Converter'
import { colors } from "../Assets/colors"
import React, { useRef } from "react";

export const ScanBtn = ({ text, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={style.btn}>
            <Text style={style.btnTxt}>{text}</Text>
        </TouchableOpacity>
    )
}

const style = StyleSheet.create({
    btn: {
        flex: 0,
        flexDirection: "column-reverse",
        height: 55,
        width: wp(311),
        borderRadius: 8,
        marginTop: "auto",
        marginBottom: hp(32),
        backgroundColor: colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',

    },
    btnTxt: {
        fontSize: 17,
        color: colors.fontWhite
    }
})