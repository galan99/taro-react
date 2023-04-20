import Taro from "@tarojs/taro";


/**
 * 给的文件资源是否小于LimitSize （M）, 小于走lessCallBack， 大于走moreCallBack
 */
export async function imageSizeIsMoreLimitSize(imagePath, limitSize) {
  console.log("filePath:"+imagePath,"imageSizeIsMoreLimitSize")
  const {size = 0}: any = await Taro.getFileInfo({filePath: imagePath});
  return size > 1024 * 1024 * limitSize;
} // 主调用方法

/**
 * 获取小于限制大小的Image, limitSize默认为1M，递归调用。
 */

export async function getLessLimitSizeImage(canvasId, imagePath, limitSize = 5, drawWidth) {
  const isLessLimitSize = await imageSizeIsMoreLimitSize(imagePath, limitSize);
  if (!isLessLimitSize) return imagePath;

  const imageInfo = await Taro.getImageInfo({src: imagePath});
  let maxSide = Math.max(imageInfo.width, imageInfo.height) //画板的宽高默认是windowWidth
  let windowW = drawWidth
  let scale = 1
  if (maxSide > windowW) {
    scale = windowW / maxSide
  }
  let imageW = Math.floor(imageInfo.width * scale)
  let imageH = Math.floor(imageInfo.height * scale)
  const pressImgPath = await getCanvasImage(canvasId, imagePath, imageW, imageH);
  return await getLessLimitSizeImage(canvasId, pressImgPath, limitSize, drawWidth * 0.7)
}

/**
 * 获取画布图片
 */

export async function getCanvasImage(canvasId, imagePath, imageW, imageH) {
  const ctx = Taro.createCanvasContext(canvasId)
  //适配ios系统像素比  不作处理 本地保存后图片宽高会乘以像素比大小
  const resource = await Taro.getSystemInfo({})
  if (resource.platform == "ios"){
    imageW= imageW / resource.pixelRatio
    imageH = imageH / resource.pixelRatio
  }
  ctx.drawImage(imagePath, 0, 0, imageW, imageH)
  ctx.fillStyle = '#ffffff'
  return await new Promise((resolve) => {
    ctx.draw(true, () => {
      Taro.canvasToTempFilePath({
        canvasId: canvasId,
        x: 0,
        y: 0,
        width: imageW,
        height: imageH,
        destWidth: imageW,
        destHeight: imageH,
        fileType: 'png',
        success(res) {
          resolve(res.tempFilePath)
        }
      });
    })
  });
}

export async function getLessLimitSizeImage_png(canvasId, imagePath, limitSize = 5, drawWidth) {
  const isMoreLimitSize = await imageSizeIsMoreLimitSize(imagePath, limitSize);
  if (!isMoreLimitSize) {
    console.log("isLessLimitSize:" + isMoreLimitSize, "宽高")
    // const res = await Taro.getSystemInfo({})
    // if (res.platform == "ios") {
    //   return await getCanvasImage(canvasId, imagePath, 102 / res.pixelRatio, 36 / res.pixelRatio)
    // } else {
    //
    // }
    return await getCanvasImage(canvasId, imagePath, 102, 36)
  } else {
    console.log("filePath:"+imagePath,"getLessLimitSizeImage_png")
    const processImgPath = await getLessLimitSizeImage(canvasId, imagePath, limitSize, drawWidth * 0.7)
    return await getLessLimitSizeImage_png(canvasId, processImgPath, limitSize, drawWidth)
  }
}

export default {
  getLessLimitSizeImage,
  imageSizeIsLessLimitSize: imageSizeIsMoreLimitSize,
  getCanvasImage,
  getLessLimitSizeImage_png
}


