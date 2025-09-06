import { ThemeText } from "@/components/layout/ThemeText"
import { SPACING } from "@/constants/layout"
import { forwardRef, useImperativeHandle, useState } from "react"
import { StyleSheet, TextInput, View } from "react-native"
import { PolishColumnRef } from "./types"



const NoteInput = forwardRef<PolishColumnRef<string>, {val: string}>((props, ref) => {
  const [text, setText] = useState('')

  useImperativeHandle(ref, () => ({
    getValue: () => text,
    setValue: (val) => setText(val)
  }))
  return (
    <View style={styles.container}>
      <ThemeText>備註</ThemeText>
      <TextInput
        onChangeText={(val) => {setText(val)}}
      />
    </View> 
  )
})

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    height: 200
  }
})

NoteInput.displayName = 'NoteInput'

export default NoteInput