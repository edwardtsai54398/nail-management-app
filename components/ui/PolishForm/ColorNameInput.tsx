import {forwardRef, memo, useImperativeHandle, useState} from "react";
import type {PolishColumnRef} from "./types";
import DetailInput from "@/components/ui/DetailInput";

type ColorNameInputProps = {
    val: string
}



const ColorNameInput = forwardRef<PolishColumnRef<string>, ColorNameInputProps>((
    {val},
    ref
) => {
    const [colorName, setColorName] = useState(val)

    useImperativeHandle(ref, () => ({
        getValue: () => colorName,
        setValue: (val: string) => {setColorName(val)}
    }))
    return (
        <DetailInput label="色號" type="input" border="bottom" placeholder="輸入色號" value={colorName} onChangeValue={(val) => {setColorName(val)}} />
    )
})

ColorNameInput.displayName = "ColorNameInput"

export default memo(ColorNameInput)