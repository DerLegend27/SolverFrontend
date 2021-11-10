import { PureComponent } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    PixelRatio,
} from 'react-native'
import React from "react";
import { RNCamera } from "react-native-camera";
import {wp, hp, absolutePx} from '../Helper/Converter'
import {colors} from "../Assets/colors"

export class Camera extends PureComponent{
    constructor(props){
        super(props)
        this.camRef = React.createRef();
        
    };
    
    requestCalc = async() => {
        let pic = await this.takePicture()
        if(pic == "error"){
            return
        }
        this.props.navigation.navigate('Result', {pic: pic})   
    }
    
    takePicture = async() =>{
        const options = {
            quality: 0.85,
            fixOrientation: true,
            forceUpOrientation: true,
            base64: true,
            doNotSave: true
          };
        
        try {
            let response = await this.camRef.current.takePictureAsync(options)
            const basePic = response.base64
            return basePic

        }catch(error){
            console.error("picture taking error: " + error)
            alert("Foto konnte nicht aufgenommen werden")
            return "error"
        }

            
        
    }

   
    
    render(){
    return(
       <View style={styles.container}>
            <RNCamera ref={this.camRef} captureAudio={false} style={styles.cam} type={RNCamera.Constants.Type.back}>
                <TouchableOpacity onPress={this.requestCalc} style={styles.btn}>
                    <Text style={styles.btnTxt}>Scannen</Text>
                </TouchableOpacity>
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
    btn: {
        flex: 0,
        height: 55,
        width: wp(311),
        borderRadius: 8,
        marginTop: hp(558),
        backgroundColor: colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center'
        
    },
    btnTxt:{
        fontSize: 17,
        color: colors.fontWhite

    }
   
  });


