import React, { FC, useState, useEffect, useImperativeHandle, forwardRef, useMemo} from 'react';
import {View} from "@tarojs/components"
import './index.scss'

interface propsTypes {

}

const Item = () => {

}

const Index:FC<propsTypes> = (props) => {
  const {} = props
  return (
    <View className='category-dpage'>
      <View className='category-dpage-mt'>
        <View className='mt-item'>一级类目</View>
        <View className='mt-item'>一级类目</View>
        <View className='mt-item'>一级类目</View>
      </View>
      <View className='category-dpage-mc'>
        <View className='mc-ul'>
          <View className='mc-ul-item'>商品1</View>
          <View className='mc-ul-item'>商品1</View>
          <View className='mc-ul-item'>商品1</View>
        </View>
      </View>
    </View>
  )
}

export default Index;