/* 工厂认证配置 */
export const FACTORY_FILED_NAME = {
  /* 是否为工厂直营 */
  ISDIRECTLY: 'isDirectly',
  /* 生产企业名称 */
  NAME: 'name',
  /* 生产企业执照 */
  LICENSEPICS: 'licensePics',
  /* 生产企业营业期限 */
  LICENSETIME: 'licenseTime',
  /* 生产企业与店铺主体的关系 */
  RELATION: 'relation',
  /* 授权书 */
  AUTHORIZATIONPICS: 'authorizationPics',
  /* 授权书-有效期限 */
  AUTHORIZATIONTIME: 'authorizationTime',
  /* 工厂照片 */
  PLANTPICS: 'plantPics'
};

const FACTORY_ITEMS = [
  {
    fieldType: 'select',
    fieldName: FACTORY_FILED_NAME.ISDIRECTLY,
    fieldValue: '',
    labelName: '是否为工厂直营',
    props : {
      placeholder: '店主与生产企业相同或为企业法人请选择',
      options: [
        { label: "是", value: "true" },
        { label: "否", value: "false" },
      ]
    }
  },
  {
    fieldType: 'input',
    fieldName: FACTORY_FILED_NAME.NAME,
    fieldValue: '',
    labelName: '生产企业名称',
    props : {
      placeholder: '请填写营业执照注册公司名',
    }
  },
  {
    fieldType: 'upload',
    fieldName: FACTORY_FILED_NAME.LICENSEPICS,
    fieldValue: [],
    labelName: '生产企业营业执照',
    props : {
      maxNum: 1,
      tipHtml: '请上传生产企业营业执照图片，复印件需加盖公章'
    }
  },
  {
    fieldType: 'time',
    fieldName: FACTORY_FILED_NAME.LICENSETIME,
    fieldValue: '',
    labelName: '生产企业营业期限',
    props : {
      titleHtml: '营业期限距今需大于三个月'
    }, 
  },
  {
    fieldType: 'select',
    fieldName: FACTORY_FILED_NAME.RELATION,
    fieldValue: '',
    labelName: '生产企业与店铺主体的关系',
    props : {
      placeholder: '请选择',
      options: [
        { label: "自有工厂",value: 1 },
        { label: "代工厂",value: 2 },
        { label: "经销商",value: 3 },
        { label: "代销商",value: 4 },
      ]
    }
  },
  {
    fieldType: 'upload',
    fieldName: FACTORY_FILED_NAME.AUTHORIZATIONPICS,
    fieldValue: [],
    labelName: '授权书',
    props : {
      maxNum: 2,
      tipHtml: '请上传授权书',
    },
    showCodition: (values) => values[FACTORY_FILED_NAME.ISDIRECTLY] === "false"
  },
  {
    fieldType: 'time',
    fieldName: FACTORY_FILED_NAME.AUTHORIZATIONTIME,
    fieldValue: '',
    labelName: '授权书有效期',
    props : {
      titleHtml: '营业期限距今需大于三个月'
    },
    showCodition: (values) => values[FACTORY_FILED_NAME.ISDIRECTLY] === "false" 
  },
  {
    fieldType: 'upload',
    fieldName: FACTORY_FILED_NAME.PLANTPICS,
    fieldValue: [],
    labelName: '工厂照片',
    props : {
      maxNum: 3,
      tipHtml: '提交内容包括但不限于工厂照片，如包含厂名信息，生产流水线信息，仓储管理',
    },
  },
]

const FACTORY_MESSAGES = {
  [FACTORY_FILED_NAME.ISDIRECTLY]: '请选择是否为工厂直营',
  [FACTORY_FILED_NAME.NAME]: '请输入生产企业名称',
  [FACTORY_FILED_NAME.LICENSEPICS]: '请上传生产企业营业执照',
  [FACTORY_FILED_NAME.LICENSETIME]: '请选择生产企业营业期限',
  [FACTORY_FILED_NAME.RELATION]: '请选择生产企业与店铺主体的关系',
  [FACTORY_FILED_NAME.AUTHORIZATIONPICS]: '请上传授权书',
  [FACTORY_FILED_NAME.AUTHORIZATIONTIME]: '请选择授权书有效期',
  [FACTORY_FILED_NAME.PLANTPICS]: '请上传工厂照片',
}

export const FACTORY_CONFIG = {
  FILED_NAMES: FACTORY_FILED_NAME,
  ITEMS: FACTORY_ITEMS,
  MESSAGES: FACTORY_MESSAGES,
}


/* 达人认证配置 */
const MASTER_FILED_NAME = {
  /* 站外平台 */
  PLATFORM: 'platform',
  /* 粉丝数量 */
  LEVEL: 'level',
  /* 用户昵称 */
  NAME: 'name',
  /* 后台管理截图 */
  ADMINPICS: 'adminpics',
  /* 达人与店铺主体的关系 */
  RELATION: 'relation',
  /* 关系证明截图 */
  RELATIONPICS: 'relationPics',
};

const MASTER_ITEMS = [
  {
    fieldType: 'select',
    fieldName: MASTER_FILED_NAME.PLATFORM,
    fieldValue: '',
    labelName: '站外平台',
    props : {
      placeholder: '请选择您在哪个站外平台有粉丝',
      options: [
        { label: "抖音", value: "1" },
        { label: "快手", value: "2" },
        { label: "小红书", value: "3" },
        { label: "微博", value: "4" },
        { label: "B站", value: "5" },
        { label: "西瓜视频", value: "6" },
        { label: "微信视频号", value: "7" },
        { label: "其他", value: "8" },
      ]
    }
  },
  {
    fieldType: 'select',
    fieldName: MASTER_FILED_NAME.LEVEL,
    fieldValue: '',
    labelName: '粉丝数量',
    props : {
      placeholder: '请选择您的粉丝数量等级',
      options: [
        { label: "1w-10w", value: "1" },
        { label: "10w-30w", value: "2" },
        { label: "30w-50w", value: "3" },
        { label: "50w-100w", value: "4" },
        { label: "100w+", value: "5" },
      ]
    }
  },
  {
    fieldType: 'input',
    fieldName: MASTER_FILED_NAME.NAME,
    fieldValue: '',
    labelName: '站外平台用户昵称/ID',
    props : {
      placeholder: '请填写站外平台用户昵称/ID',
    }
  },
  {
    fieldType: 'upload',
    fieldName: MASTER_FILED_NAME.ADMINPICS,
    fieldValue: [],
    labelName: '达人账号管理后台截图',
    props : {
      maxNum: 1,
      tipHtml: '请上传达人账号管理后台截图'
    }
  },
  {
    fieldType: 'select',
    fieldName: MASTER_FILED_NAME.RELATION,
    fieldValue: '',
    labelName: '达人与店铺经营者的关系',
    props : {
      placeholder: '请选择达人与店铺经营者的关系',
      options: [
        { label: "本人",value: 1 },
        { label: "法人",value: 2 },
        { label: "雇佣",value: 3 },
        { label: "合伙人",value: 4 },
      ]
    }
  },
  {
    fieldType: 'upload',
    fieldName: MASTER_FILED_NAME.RELATIONPICS,
    fieldValue: [],
    labelName: '关系证明文件',
    props : {
      maxNum: 1,
      tipHtml: '请上传关系证明文件（提供协议样本）',
    },
  },
]

const MASTER_MESSAGES = {
  [MASTER_FILED_NAME.PLATFORM]: '请选择站外平台',
  [MASTER_FILED_NAME.LEVEL]: '请选择粉丝数量',
  [MASTER_FILED_NAME.NAME]: '请输入站外平台用户昵称/ID',
  [MASTER_FILED_NAME.ADMINPICS]: '请上传达人账号管理后台截图',
  [MASTER_FILED_NAME.RELATION]: '请选择达人与店铺经营者的关系',
  [MASTER_FILED_NAME.RELATIONPICS]: '请上传关系证明文件',
}


export const MASTER_CONFIG = {
  FILED_NAMES: MASTER_FILED_NAME,
  ITEMS: MASTER_ITEMS,
  MESSAGES: MASTER_MESSAGES,
}

/* 设计师认证配置 */
const DESIGNER_FILED_NAME = {
  /* 设计领域 */
  AREA: 'area',
  /* 设计师姓名 */
  NAME: 'name',
  /* 设计师与店铺经营者的关系 */
  RELATION: 'relation',
  /* 关系证明照片 */
  RELATIONPICS: 'relationPics',
  /* 资格证书照片 */
  CREDENTIALPICS: 'credentialPics',
  /* 获奖证书照片 */
  DIPLOMAPICS: 'diplomaPics',
};

const DESIGNER_ITEMS = [
  {
    fieldType: 'select',
    fieldName: DESIGNER_FILED_NAME.AREA,
    fieldValue: '',
    labelName: '设计领域',
    props : {
      placeholder: '请选择设计领域',
      options: [
        { label: "服装", value: "1" },
        { label: "家居家具", value: "2" },
        { label: "珠宝", value: "3" },
        { label: "文创用品", value: "4" },
        { label: "鞋包", value: "5" },
        { label: "体育用品", value: "6" },
        { label: "玩具", value: "7" },
      ]
    }
  },
  {
    fieldType: 'input',
    fieldName: DESIGNER_FILED_NAME.NAME,
    fieldValue: '',
    labelName: '设计师姓名',
    props : {
      placeholder: '请填写设计师姓名',
    }
  },
  {
    fieldType: 'select',
    fieldName: DESIGNER_FILED_NAME.RELATION,
    fieldValue: '',
    labelName: '设计师与店铺经营者的关系',
    props : {
      placeholder: '请选择设计师与店铺经营者的关系',
      options: [
        { label: "本人",value: 1 },
        { label: "法人",value: 2 },
        { label: "雇佣",value: 3 },
        { label: "合伙人",value: 4 },
      ]
    }
  },
  {
    fieldType: 'upload',
    fieldName: DESIGNER_FILED_NAME.RELATIONPICS,
    fieldValue: [],
    labelName: '关系证明文件',
    props : {
      maxNum: 1,
      tipHtml: '请上传关系证明的照片',
    },
  },
  {
    fieldType: 'upload',
    fieldName: DESIGNER_FILED_NAME.CREDENTIALPICS,
    fieldValue: [],
    labelName: '设计师资格证书',
    props : {
      maxNum: 3,
      tipHtml: '请上传如国际商业美术设计师ICAD、设计师专业毕业证书的照片等',
    },
  },
  {
    fieldType: 'upload',
    fieldName: DESIGNER_FILED_NAME.DIPLOMAPICS,
    fieldValue: [],
    labelName: '获奖证书证明文件',
    props : {
      maxNum: 3,
      tipHtml: '请上传获奖证书证明文件的照片',
      required: false,
    },
  },
]

const DESIGNER_MESSAGES = {
  [DESIGNER_FILED_NAME.AREA]: '请选择设计领域',
  [DESIGNER_FILED_NAME.NAME]: '请输入设计师姓名',
  [DESIGNER_FILED_NAME.RELATION]: '请选择设计师与店铺经营者的关系',
  [DESIGNER_FILED_NAME.RELATIONPICS]: '请上传关系证明文件',
  [DESIGNER_FILED_NAME.CREDENTIALPICS]: '请上传资格证书照片',
  [DESIGNER_FILED_NAME.DIPLOMAPICS]: '请上传获奖证书照片',
}

export const DESIGNER_CONFIG = {
  FILED_NAMES: DESIGNER_FILED_NAME,
  ITEMS: DESIGNER_ITEMS,
  MESSAGES: DESIGNER_MESSAGES,
}