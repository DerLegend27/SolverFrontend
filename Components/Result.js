import {
StyleSheet,
View,
Text,
TouchableOpacity
} from "react-native"
import React, { useState, useRef, useEffect } from "react"

export const Result = ({pic,onVisible}) =>{
    const[isVisible, _setIsVisible] = useState(false) 
    const[solutionText, setSolutionText] = useState("")
    
    const setIsVisible = (bool) =>{
        _setIsVisible(bool) 
        if(bool){
            onVisible()
        }
    }
   
    const sendPicture = async() =>{
            
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

    const receiveSolution = async() => {    
        const response = await sendPicture()
        const json = await response.json()
        console.log("Response: " + json.solution)
        return json.solution
    
    }
    

    const displaySolution = async() => {
        const solution = await receiveSolution()
        setSolutionText(solution)
        setIsVisible(true)    
    }
    
    displaySolution()
    
    return(
       <View>
            {isVisible ? <Text>{solutionText}</Text>: null}
        </View> 
       );
} 

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }
   
  });


