1. taro获取路由参数

```javascript
// class写法
import { getCurrentInstance } from '@tarojs/taro'
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 1
    }
  }

  componentDidMount() {
    console.log('路由参数', this.$instance?.router?.params)
  }

  $instance = getCurrentInstance()
}


//hook写法
import Taro, {useRouter} from '@tarojs/taro';
const Index = () => {
  const router = useRouter();
  console.log(router.params)
  return (<view>test</view>)
}
```

2. 多个className
```javascript
import classNames from 'classnames'


const noticebarClass = classNames({
  'nut-noticebar-page': true,
  withicon: closeMode,
  close: closeMode,
  wrapable,
})

<View className={classNames('BusinessCategoryWrap', {category1Item_active: active,})}>测试</View>

```

3. 连续调用setState不更新

```typescript

const [state, setState] = (<Record<string, any>>{})

// 连续调用不更新
setState({
  ...state,
  ...result,
})

// 通过箭头函数把参数传递获取最新的state
setState(data => ({
    ...data,
    ...result,
}))

```

4. input遇见三方输入法，频繁切换输入法类型高度变化，页面不回弹

```javascript
import { Input } from '@tarojs/components'
import { pageScrollTo } from '@tarojs/taro'

<Input
    className={classNames(className, { 'disable-text-style': isDisableStyle })}
    placeholder={InputPlaceholder}
    value={value}
    maxlength={maxlength}
    disabled={disabled ?? !isEdit}
    onInput={e => {
        const length = !Number.isNaN(Number(maxlength)) ? maxlength : e.detail.value.length
        const val = e.detail.value.substring(0, length)
        onChange(val)
    }}
    onBlur={e => {
        if (isblurTrim) {
            onChange(e.detail.value.trim())
        }
        if (onBlur && typeof onBlur === 'function') {
            onBlur(e.detail.value.trim())
        }

        // 解决页面回弹
        if (isblurScrollTop && isJD()) {
            pageScrollTo({
              scrollTop: 0,
              duration: 0,
            })
        }
    }}/>
```
5. 
