import { PureComponent } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet
} from 'react-native'
import React from "react";
import { RNCamera } from "react-native-camera";

export class Camera extends PureComponent{
    constructor(props){
        super(props)
        this.camRef = React.createRef();
    };
    
    takePicture = async() =>{
       
        const options = {
            quality: 0.85,
            fixOrientation: true,
            forceUpOrientation: true,
          };
        try{
            data = await this.camRef.takePictureAsync(options)
        }catch(error){
            console.log(error.message)
        }
        }


    

    render(){
    return(
       <View>
            <RNCamera ref={this.camRef} captureAudio={false} style={styles.cam} type={RNCamera.Constants.Type.back}></RNCamera>
            <TouchableOpacity style={styles.btn}>
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

