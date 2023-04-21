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

2. 