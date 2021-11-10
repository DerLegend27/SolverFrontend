import {
StyleSheet,
View,
Text,
TouchableOpacity
} from "react-native"
import React, {PureComponent } from "react"
import {wp, hp} from '../Helper/Converter';

export class Result extends PureComponent{
    constructor(props){
        super(props)
        
        this.navigation = props.navigation

        this.state = {
            responseText: "",
            isVisible: false,
            hasFailure: false
        }
    }
    
    
    render(){
    
        if(this.state.isVisible && this.state.hasFailure){
            return <FailureView failureMessage={this.state.responseText}/>
            }
        else if(this.state.isVisible){
            return (<View style={styles.container}>
                <SuccessView solutionText={this.state.responseText}/>
                <TouchableOpacity onPress={()=>this.navigation.goBack()}>
                    <Text>Zurück</Text>
                </TouchableOpacity>
            </View>)
            }
        else{
            return null
        }

    }

    setIsVisible = (bool) =>{
        this.setState({
            isVisible : bool
        })
    }
    
    sendPicture = async(pic) =>{
            
        const picData = new FormData();
        const url = "http://10.0.2.2:8080"
        picData.append("image", pic)
        
        try{
            const response = await fetch(
                url,
                {
                    method: 'post',
                    body: picData,
                    headers: {
                        "Content-Type":
                        'multipart/form-data'
                    }
                }
            )
            
            return response
            
            
        }catch (error){
            console.error("Connection error: " + error)

        } 
    }

    receiveResponseText = async(pic) => {    
        try{
            const response = await this.sendPicture(pic)
            const json = await response.json()
            if(json.status == "failure"){
                const failureMessage = "Aufgabe konnte nicht erkannt werden"
                this.setState({
                    hasFailure: true
                })
                return failureMessage
            }else{
                return json.solution
            }
            
        }catch (error){
            console.error("Json Receiving Error: " + error)
        }
        
    
    }


    displayResponseText = async(pic) => {
        try{
            const responseText = await this.receiveResponseText(pic)
            this.setState({
                responseText : responseText
            })
            this.setIsVisible(true)  
        }catch(error){
            console.error("Displaying Error: " + error)
        }
          
    }

}

const FailureView = ({failureMessage}) =>{
    return (
        <View>
            <Text>{failureMessage}</Text>
        </View>
    )
}
const SuccessView = ({solutionText}) =>{
    return (
        <View>
            <Text>{solutionText}</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }
   
  });




