import { PureComponent } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Image
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
            return "error"
        }

            
        
    }

   
    

    render(){
    return(
       <View style={styles.container}>
            <RNCamera ref={this.camRef} captureAudio={false} style={styles.cam} type={RNCamera.Constants.Type.back}/>
            
            <TouchableOpacity onPress={this.requestCalc} style={styles.btn}>
                <Text>Calculate</Text>
            </TouchableOpacity>
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

