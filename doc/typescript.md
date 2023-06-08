### 常用ts

```typescript
// 枚举
enum FlowTypes {
  Enter = 1,
  Brand,
  Qualification,
  Category
}
interface ComOpt {
  applyId?: string | number
  quaId: string | number
  flowType: FlowTypes
}

// type 混合
type OpTions = ComOpt & { filePath: string }
const data = {} as OpTions

const extOthers = {} as Record<string, number>
extOthers.a = 2

interface ApiKey {
  id: number;
  name: string;
}
// 泛型
// Partial<T> 的作用就是将某个类型里的属性全部变为可选项 ?
type BasePageProps<T> = Partial<T> & {
    [key in number]: any;
}

const a:BasePageProps<ApiKey> = {2: 1, id: 3}

console.log(FlowTypes.Brand, data)
```