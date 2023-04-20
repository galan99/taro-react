import { useEffect, useState } from 'react'
import { View, Text, Image as Img } from '@tarojs/components'
import { Icon, Popup } from '@nutui/nutui-react-taro'
import Taro from '@tarojs/taro'
import { dsmUpload } from '@framework/network/dsm-api'
import { getLessLimitSizeImage } from '@/utils/ImageUtils';
import './index.scss'

const UploadBarImg = 'https://img10.360buyimg.com/imagetools/jfs/t1/201609/25/29353/3015/63a02eb1Eac4c1a93/6fb77f2e47a051cb.png'

export interface UploadBarProps {
  defaultImgUrl?: string
  // reviewImageUrl: string
  className?: string
  url?: string
  maximum?: number
  multiple?: boolean
  accept?: string
  maximize?: number
  pathResult?: (arg0: any) => void
  filePath?: any[]
  overwriteStyle?: {
    [key: string]: any
  }
  isLogo?: boolean
  onResult: Function
  // minLimit?: number
  showImagePreview?: boolean;
  isCloseChooseImage?: boolean
}

export const UploadBar = (props: UploadBarProps) => {
  const { onResult, filePath = [], showImagePreview = true, isCloseChooseImage } = props;
  const [fileList, setFileList] = useState<any[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('');
  // console.log(filePath, 'filePathfilePathfilePath');

  // 图片回显
  const handlePreview = async (secretPath: string, fileName, echo?) => {
    try {
      const query = {
        query: {
          filePath: secretPath
        },
        callerParam: {
          site: 'APP',
          buid: '301',
          tenantId: '1024',
          terminal: '1024'
        }
      }
      const { data, code } = await dsmUpload<Array<any>>({
        api: 'dsm.seller.qua.view.ohs.export.service.certificate.SellerFileFacade.viewFile',
        data: query,
        handlerError: false
      })
      if (+code === 200) {
        successFn();
        const { viewUrl } = data as any;
        if (echo === 'echo') {
          return viewUrl;
        } else {
          imageUrlList.push({
            imageUrl: viewUrl,
            fileKey: secretPath,
            fileName,
          })
          setImageUrlList([...imageUrlList])
        }
      }
    } catch (error) {
      // console.log(error);
    }
  }

  useEffect(() => {
    if (filePath.length) {
      const list = filePath.map(async (v) => {
        const { fileKey, fileName } = v;
        return await handlePreview(fileKey, fileName, 'echo').then(res => {
          return { fileKey, fileName, imageUrl: res }
        })
      })
      Promise.all(list).then(res => {
        setImageUrlList(res)
      })
    }
  }, [])

  const [imageUrlList, setImageUrlList] = useState<any>([...filePath]);
  const [isLoading, setIsloading] = useState(false);
  const [isFailure, setIsFailure] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const callerParam = {
    site: 'APP',
    buid: '301',
    tenantId: '1024',
    terminal: '1024'
  }

  useEffect(() => {
    onResult(imageUrlList)
  }, [imageUrlList])

  const failFn = () => {
    setIsFailure(true);
    setIsloading(false);
  }
  const loadingFn = () => {
    setIsloading(true);
    setIsFailure(false);
  }
  const successFn = () => {
    setIsFailure(false);
    setIsloading(false);
  }
  
  // 预览
  const onActiveAvatar = (url: string) => {
    if (!showImagePreview) return;
    setImagePreview(url)
  }


  const handleUpload = async (fileStr, fileName) => {
    try {
      const query = {
        param: {
          fileStr: fileStr.toString().split('base64,')[1],
          fileName,
        },
        callerParam
      }
      const res = await dsmUpload<Array<any>>({
        api: 'dsm.seller.qua.view.ohs.export.service.certificate.SellerFileFacade.uploadFile',
        data: query,
        handlerError: false
      })
      if (res.code === 200) {
        const { path = '' }: any = res.data
        Taro.showLoading({ title: '识别中...' })
        // console.log(path, 'pathpathpathpathpathpath');
        handlePreview(path, fileName)

        // props.pathResult({ fileStr: path, fileName: imgItem.fileName })
      } else {
        failFn();
      };
    } finally {
      Taro.hideLoading()
    }
  }

  const File2Base64 = function (file) {
    const { type, size, name } = file;
    // setFileName(name);
    if (props.accept && props.accept.indexOf(type) === -1) {
      failFn();
      return Taro.showToast({ title: '请上传图片文件', icon: 'none', })
    }
    if (size > 5 * 1000 * 1024) {
      failFn();
      return Taro.showToast({ title: '图片大小不能超过5M', icon: 'none', })
    }
    let fr = new FileReader();
    //如果下面的语句执行失败，需要放入 setTimeout 异步处理
    fr.readAsDataURL(file);
    fr.onload = function (e) {
      // // console.log(this.result);// base64
      // // console.log(e.target.result);// base64
      // let base64 = e.target.result;// data:image/jpeg;base64,/9j/4AAQSkZJ
      // // console.log(base64.constructor);//ƒ String() { [native code] }
      loadingFn();
      setImageUrl(this.result?.toString() || '');
      handleUpload(this.result, name)
      setFileList([{ fileStr: this.result || '', fileName: name }]);
    }
  }

  const chooseImage = function () {
    // // console.log(minLimit,imageUrlList,'chooseImage');
    // if(imageUrlList)
    Taro.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
      success: async function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        if (process.env.TARO_ENV == 'jd') {
          // console.log("赵然~~~jd  compress")
          res.tempFiles[0].type = 'image/' + res.tempFiles[0].path.split('.')[1]
          const { type, size, path } = res.tempFiles[0];
          const pathFile = await getLessLimitSizeImage('myCompres', path, 5, 750);
          blobUrlUpload(pathFile)
        } else {
          var tempFilePaths = res.tempFiles[0].originalFileObj
          File2Base64(tempFilePaths)
        }
      }
    })
  }

  const blobUrlUpload = async function (blob) {
    loadingFn();
    const resp = 'data:image/png;base64,' + Taro.getFileSystemManager().readFileSync(blob, "base64")

    setImageUrl(resp?.toString() || '');
    handleUpload(resp, '移动端认证图片上传')
    setFileList([{ fileStr: resp || '', fileName: '移动端认证图片上传' }]);
  }

  const handleRemove = (i) => {
    const list = imageUrlList.filter((item, index) => index !== i)
    setImageUrlList([...list])

    setIsloading(false);
    setIsFailure(false);
    setFileList([]);
    setImageUrl('');
  }

  return (
    <View className='uploadImgMultiple-image-template'>
      <View className='uploadImgMultiple-image-main'>
        {
          imageUrlList.map((v, i) => {
            return <View className='preview-img' key={i}>
              <Img className='preview-img__nut-avatar' src={v.imageUrl} onClick={() => onActiveAvatar(v.imageUrl)}></Img>
              <View className='preview-img__close' onClick={() => handleRemove(i)}>
                {/* <Icon className='preview-img__close-icon' color='#fff' size={14} name='close'></Icon> */}
                <img className='preview-img__close-icon' src='https://img13.360buyimg.com/imagetools/jfs/t1/197850/30/28467/1192/63a5912eE26e8b995/88fb1278063852c6.png' />
              </View>
            </View>
          })
        }
        {isLoading && !isFailure ?
          <View className='upload-loading'>
            <Icon name='loading' color='#fff'></Icon>
            <Text>上传中...</Text>
          </View> : null
        }

        {isFailure && !isLoading ? <View className='default-place' style={props.overwriteStyle} onClick={chooseImage}>
          <View className='uploadImgMultiple-failure'>
            <Icon name='failure'></Icon>
            <Text>上传失败</Text>
          </View>
        </View> : null}
        {!isCloseChooseImage && imageUrlList.length !== 20 && <View className='default-place' style={props.overwriteStyle} onClick={chooseImage}>
          <img className='preview-img__close-icon' src={UploadBarImg} alt='' width='24px' height='24px' />
        </View>}
      </View>
      <canvas canvas-id='myCompres' className='press-canvas'></canvas>
      <Popup 
        visible={!!imagePreview} 
        round 
        style={{ width: '100%', height: '400px', background: 'none', display: 'flex', alignItems: 'center' }} 
        onClose={() => {
          setImagePreview('')
        }}
      >
        {
          imagePreview && <div className='backgroundImg' style={{ backgroundImage: 'url(' + imagePreview + ')', width: '100%', height: '100%' }} onClick={() => {
            setImagePreview('')
          }}></div>
        }
      </Popup>
    </View>
  )
}

export default UploadBar;
