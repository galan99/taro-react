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