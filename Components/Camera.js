import { PureComponent } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet
} from 'react-native'
import React from "react";
import { RNCamera } from "react-native-camera";
import { tsImportEqualsDeclaration } from "@babel/types";

export class Camera extends PureComponent{
    constructor(props){
        super(props)
        this.camRef = React.createRef();
    };
    
    requestCalc = async() => {
   /*  let img = await this.takePicture()
     if(img == "error"){
        return
     }
        */
    this.sendPicture()   
    }
    
    takePicture = async() =>{
       
        const options = {
            quality: 0.85,
            fixOrientation: true,
            forceUpOrientation: true,
            base64: true
            
          };
        try {
            let response = await this.camRef.current.takePictureAsync(options)
            const baseImg = response.base64
            return baseImg
        }catch(error){
            console.log("picture taking error: " + error)
            return "error"
        }

            
        
    }

    sendPicture = async() =>{
        try{
            const response = await fetch("http://127.0.0.1:8080")
            console.log(response)
        }catch{
            console.log("Connection error")
        }
    }
    

    render(){
    return(
       <View>
            <RNCamera ref={this.camRef} captureAudio={false} style={styles.cam} type={RNCamera.Constants.Type.back}></RNCamera>
            <TouchableOpacity onPress={this.requestCalc} style={styles.btn}>
                <Text>Calculate</Text>
            </TouchableOpacity>
        </View>
    );
    }
    
    
}

const styles = StyleSheet.create({
    cam: {
        flex: 0,
        width: 300,
        height: 300,
    }, 
    btn: {
        flex: 0,
        height: 50,
        width: 100,
        marginBottom: "20%",
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center'
        
    }
   
  });

