import { PureComponent, useEffect, useState } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    PixelRatio,
    PanResponder,
    Image
} from 'react-native'
import React from "react";
import { RNCamera } from "react-native-camera";
import { wp, hp, absolutePx } from '../Helper/Converter'
import { colors } from "../Assets/colors"
import { ScanWindow } from "./ScanWindow"
import Svg, { Polyline, G, Rect, Defs, Use } from "react-native-svg";
import {
    widthPercentageToDP as wp2dp,
    heightPercentageToDP as hp2dp,
} from 'react-native-responsive-screen';
import ImageEditor from "@react-native-community/image-editor";

import { captureScreen } from 'react-native-view-shot';
import { ScanBtn } from "./ScanBtn";
import { HelpBtn } from "./HelpBtn";



export class Camera extends PureComponent {
    constructor(props) {
        super(props)
        this.camRef = React.createRef();
        this.scanRef = React.createRef();

    };

    requestCalc = async () => {
        var pic = ""
        try {
            pic = await this.takePicture()

            if (pic == "error") {
                return
            }

            const base64Pic = await this.cropImage(pic)
            this.props.navigation.navigate('Result', { croppedPic: base64Pic, pic: pic })
        } catch (e) {
            console.log("Requesting error: " + e)
        }


    }
    cropImage = async (pic) => {

            const uri = pic

            const svgX = this.scanRef.current.svgCords.x
            const svgY = this.scanRef.current.svgCords.y

            const offX = absolutePx(svgX + this.scanRef.current.state.leftX)
            const offY = absolutePx(svgY + this.scanRef.current.state.topY)

            const width = absolutePx(this.scanRef.current.state.rightX - this.scanRef.current.state.leftX)
            const height = absolutePx(this.scanRef.current.state.bottomY - this.scanRef.current.state.topY)


            const cropData = {
                offset: { x: offX, y: offY },
                size: { width: width, height: height }
            }


            var RNFS = require('react-native-fs');

        try{   
            const croppedRawUrl = await ImageEditor.cropImage(uri, cropData)
            const base64Pic = await RNFS.readFile(croppedRawUrl, "base64")
            return base64Pic
        }catch(e){
            console.log("Cropping error: " + e)
            return "error"
        } 

        }


    takePicture = async () => {
        try {
            let uri = await captureScreen()
            return uri
        } catch (e) {
            console.log("Screenshot error: " + e)
            alert("Foto konnte nicht aufgenommen werden!")
            return "error"
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <RNCamera ref={this.camRef} captureAudio={false} style={styles.cam} type={RNCamera.Constants.Type.back}>


                    <View style={styles.menuBar}>
                        <TouchableOpacity style={styles.menuBtn}>
                            <Image style={styles.menuImg} source={require("../Assets/Images/Menu.png")} />
                        </TouchableOpacity>
                        <View style={{ flexDirection: "row-reverse", flex: 1 }}>
                            <HelpBtn/>
                            <TouchableOpacity style={styles.menuBtn}>
                                <Image style={styles.flashImg} source={require("../Assets/Images/flash.png")} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScanWindow style={styles.scanWindow} ref={this.scanRef} />
                    <ScanBtn onPress={this.requestCalc} text={"Scannen"} bottom={32}/>
                </RNCamera>


            </View>
        );
    }


}





const styles = StyleSheet.create({
    container: {
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cam: {
        flex: 0,
        width: "100%",
        height: "100%",
        alignItems: 'center',
    },
  
    menuBar: {
        flex: 0,
        flexDirection: "row",
        marginTop: hp(30),
        marginHorizontal: wp(16),


    },

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

    


});


