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

5. vite react开发项目，不支持可选链白屏问题

```javascript
/*
"dependencies": {
    "antd-mobile": "^5.16.1",
    "antd-mobile-icons": "^0.3.0",
    "axios": "^0.21.1",
    "classnames": "^2.3.1",
    "dayjs": "^1.11.9",
    "react": "^17.0.0",
    "react-dom": "^17.0.0",
    "react-redux": "^7.2.4",
    "react-router-config": "^5.1.1",
    "react-router-dom": "^5.2.0",
    "redux": "^4.0.5",
    "redux-thunk": "^2.3.0",
  },
  devDependencies: {
    "@babel/plugin-proposal-nullish-coalescing-operator": "^7.18.6",
    "@babel/plugin-proposal-optional-chaining": "^7.21.0",
    "@types/qs": "^6.9.7",
    "@types/react": "^18.0.14",
    "@types/react-dom": "^18.0.5",
    "@types/react-router-config": "^5.0.6",
    "@types/react-router-dom": "^5.3.3",
    "@typescript-eslint/eslint-plugin": "^5.30.6",
    "@typescript-eslint/parser": "^5.30.6",
    "@vitejs/plugin-legacy": "^1.8.2",
    "@vitejs/plugin-react": "^1.3.2",
    "@vitejs/plugin-react-refresh": "^1.3.1",
    "cross-env": "^7.0.3",
    "eslint": "^7.19.0",
    "eslint-config-standard": "^17.0.0",
    "eslint-plugin-import": "^2.26.0",
    "eslint-plugin-n": "^15.2.3",
    "eslint-plugin-promise": "^6.0.0",
    "eslint-plugin-react": "^7.30.1",
    "husky": "^4.2.5",
    "less": "^4.1.1",
    "less-vars-to-js": "^1.3.0",
    "lint-staged": "^8.1.7",
    "postcss": "^8.4.14",
    "postcss-pxtorem": "^6.0.0",
    "terser": "^5.14.1",
    "typescript": "^4.7.4",
    "vite": "^2.0.5",
    "vite-plugin-imp": "^2.3.1"
  }
*/


// vite.config.js
import reactRefresh from '@vitejs/plugin-react-refresh'
import react from '@vitejs/plugin-react'

{
  plugins: {
    react({
      babel: {
        plugins: [
          '@babel/plugin-proposal-optional-chaining',
          '@babel/plugin-proposal-nullish-coalescing-operator'
        ]
      }
    }),
    reactRefresh({
      parserPlugins: ['optionalChaining', 'nullishCoalescingOperator']
    }),
    ...
  }
}
```
