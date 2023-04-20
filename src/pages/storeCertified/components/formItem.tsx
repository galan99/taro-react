import { View, Text } from '@tarojs/components'

interface propsConfig {
    label: string;
    titleHtml?: JSX.Element;
    errorText?: string;
    isUpload?: boolean;
    children?: JSX.Element;
    tipHtml?: JSX.Element;
}

const FildComponent: React.FC<propsConfig> = props => {
    const { label, titleHtml = '', tipHtml = '', errorText, isUpload = false } = props
    return (
        <View className='fitem'>
            <View className='fitem-header'>
                <View className='fitem-header-title'>
                    <View className='fitem-header-title-left'>
                        {label}
                        <Text className='required'>*</Text>
                    </View>
                    {titleHtml}
                    {/*<View className='fitem-header-title-other'>有效期距今需大于三个月</View>*/}
                </View>
                {tipHtml}
                {/*<View className='fitem-header-tip'>请上传生产企业营业执照图片，复印件需加盖公章</View>*/}
            </View>
            <View className='fitem-content'>
              <View className={!isUpload ? 'fitem-content-default' : ''}>{props.children}</View>
              {errorText && <View className='fitem-content-error-tip'>{errorText}</View>}
            </View>
        </View>
    )
}

export default FildComponent
