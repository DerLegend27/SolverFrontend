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
    
    
    
    return(
       <View>
            <TouchableOpacity onPress={() => displaySolution()}>
                <Text>Click</Text>
            </TouchableOpacity>
            {isVisible ? <Text>{solutionText}</Text>: null}
        </View> 
       );
} 

const displaySolution = async(pic) => {
    const solution = await receiveSolution(pic)
    setSolutionText(solution)
    setIsVisible(true)    
}

const receiveSolution = async(pic) => {    
    const response = await sendPicture(pic)
    const json = await response.json()
    return json.solution

}


const sendPicture = async(pic) =>{
        
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
            console.log("Response: " + response)
            return response
            
            
        }catch (error){
            console.error("Connection error: " + error)

        } 
    }




const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }
   
  });