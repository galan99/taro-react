import React, {FC} from "react";
import {View} from "@tarojs/components"
import CategoryDetail from "@/components/CategoryDetail";
import SetData from "./components/SetData"

const Index = () => {
  return (
    <View>
      <CategoryDetail />
      <SetData />
    </View>
  )
}

export default Index