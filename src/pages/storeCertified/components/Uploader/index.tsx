import  React, { useState  } from "react";
import { Uploader, Icon } from '@nutui/nutui-react-taro';
import Taro from '@tarojs/taro'
import { View} from '@tarojs/components'
import './index.scss'

const Index = (props) => {
  const {
    defaultValue, 
    maximum = 2, 
    accept='image/png,image/jpg,image/jpeg', 
    multiple = true,
    maximize = 1024 * 1024 * 5, 
    onChange
 } = props
  const uploadUrl = 'dsm.seller.qua.view.ohs.export.service.certificate.SellerFileFacade.uploadFile'

  const onSuccess = (ev) => {
    console.log("上传成功")
  }

  const onRemove = (file) => {
    console.log('删除')
  }

  const onOversize = (files) => {
    Taro.showToast({ title: '图片大小不能超过5M', icon: 'none' })
  }

  const onBeforeUpload = (files) => {
    console.log(files)
    return true
  }

  return ( 
    <View className='upload-component'>   
      <Uploader
        className='upload'
        accept={accept}
        maximum={maximum}
        multiple={multiple}
        url={uploadUrl}
        onSuccess={onSuccess}
        onRemove={onRemove}
        maximize={maximize}
        onOversize={onOversize}
        onBeforeXhrUpload={onBeforeUpload} 
        style={{ marginRight: '10px' }}
      />
    </View>
  );
};

export default Index;