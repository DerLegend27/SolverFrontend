import { PureComponent, useEffect, useState } from "react";
import Svg, { Polyline, G, Rect, Defs, Use } from "react-native-svg";
import {
    widthPercentageToDP as wp2dp,
    heightPercentageToDP as hp2dp,
  } from 'react-native-responsive-screen';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    PixelRatio,
    PanResponder,
} from 'react-native'
import React from "react";
import { hp, wp } from "../Helper/Converter";
import { colors } from "../Assets/colors";


export class ScanWindow extends PureComponent{
    constructor(props){
        super(props)
        
        

        this.cornerWidth = 8
        this.cornerPadding = this.cornerWidth

        this.maxWidth = wp2dp(85)
        this.maxHeight = this.maxWidth
        this.minWidth = 90
        this.minHeight = this.minWidth
        
        this.prevWidth = wp2dp(85)
        this.prevHeight = hp2dp(25)

        this.state = {
            actualWidth: this.prevWidth,
            actualHeight: this.prevHeight,
            
        }

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this.alwaysTrue,
            onMoveShouldSetPanResponder: this.alwaysTrue,
            onPanResponderGrant: this.handlePanResponderGrant,
            onPanResponderMove: this.handlePanResponderMove,
        });
    }
    
    alwaysTrue = () => true

    handlePanResponderGrant = () => {
        this.prevWidth = this.state.actualWidth
        this.prevHeight = this.state.actualHeight
    }

    handlePanResponderMove = (e, gestureState) =>{
        
        const newWidth = gestureState.dx + this.prevWidth
        const newHeight = gestureState.dy + this.prevHeight
        
        if(newWidth <= this.maxWidth && newWidth >= this.minWidth){
            this.setState({
                actualWidth: gestureState.dx + this.prevWidth,
            })
        }
        if(newHeight <= this.maxHeight && newHeight >= this.minHeight){
            this.setState({
                actualHeight: gestureState.dy + this.prevHeight,
            })
        }
    }

    render(){
        return(
       
            <Svg width={this.state.actualWidth} height={this.state.actualHeight} originY="100" style={styles.container}>
                    
                    <Polyline 
                        x={this.cornerPadding}
                        y={this.cornerPadding}
                        points="0,30 0,0 30,0"
                        fill="none"
                        stroke={colors.primaryColor}
                        strokeWidth={this.cornerWidth}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    />
                    <Polyline 
                        x={this.state.actualWidth-this.cornerPadding}
                        y={this.cornerPadding}
                        points="0,30 0,0 30,0"
                        fill="none"
                        stroke={colors.primaryColor}
                        strokeWidth={this.cornerWidth}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        rotation="90"
                        
                        
                    />
                    <Polyline 
                        
                        x={this.cornerPadding}
                        y={this.state.actualHeight-this.cornerPadding}
                        points="0,30 0,0 30,0"
                        fill="none"
                        stroke={colors.primaryColor}
                        strokeWidth={this.cornerWidth}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        rotation="270"
                        
                        
                    />
                    <Polyline 
                        x={this.state.actualWidth-this.cornerPadding}
                        y={this.state.actualHeight-this.cornerPadding}
                        points="0,30 0,0 30,0"
                        fill="none"
                        stroke={colors.primaryColor}
                        strokeWidth={this.cornerWidth}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        rotation="180"
                        {...this.panResponder.panHandlers}
                    />
                
            </Svg>
        
     )
    }

    
}

const styles = StyleSheet.create({
    container: {
        height:"auto",
        flex: 0,
        position: "absolute",
        marginTop: hp(222)
    }
});