// text.tsx
import React from "react"
import { StyleSheet, Text, TextProps } from "react-native"

export default function defaultFontText(props: TextProps) {
    const {style, children, ...rest} = props;
  return <Text style={[{fontFamily: 'Poppins'}, style]} {...rest}>{children}</Text>
}