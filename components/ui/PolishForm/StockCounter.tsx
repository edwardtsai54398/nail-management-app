import { forwardRef, memo, useImperativeHandle, useState } from 'react'
import { PolishColumnRef } from '@/components/ui/PolishForm/types'
import { Flex } from '@/components/layout/Flex'
import { ThemeText } from '@/components/layout/ThemeText'
import AntDesign from '@expo/vector-icons/AntDesign'
import ThemeButton from '@/components/ui/ThemeButton'

type StockCounterProps = {
  val: number
}

const StockCounter = forwardRef<PolishColumnRef<number>, StockCounterProps>((props, ref) => {
  const [count, setCount] = useState<number>(props.val)
  const handlePlus = () => {
    if (count >= 20) return
    setCount((prev) => prev + 1)
  }
  const handleMinus = () => {
    if (count <= 0) return
    setCount((prev) => prev - 1)
  }

  useImperativeHandle(ref, () => ({
    getValue: () => count,
    setValue: (count) => setCount(count),
  }))

  return (
    <Flex justify={'between'}>
      <ThemeText>庫存</ThemeText>
      <Flex justify={'center'}>
        <ThemeButton
          type={'default'}
          text
          icon={<AntDesign name={'minuscircleo'} size={20} />}
          onPress={handleMinus}
        />
        <Flex style={{ width: 36 }} justify={'center'}>
          <ThemeText size={'md'}>{count}</ThemeText>
        </Flex>
        <ThemeButton
          type={'default'}
          text
          icon={<AntDesign name={'pluscircleo'} size={20} />}
          onPress={handlePlus}
        />
      </Flex>
    </Flex>
  )
})

StockCounter.displayName = 'StockCounter'

export default memo(StockCounter)
