//afc前缀是antd-form-component的首字母缩写
//避免跟antd的命名重复
export default {
  afcCommon: {
    isRequired: '请输入%s',
    //中文字符算两个英文字符
    charactersBetwteen: '请输入%d到%d个长度的字符',
    charactersMin: '字符长度不能小于%d',
    charactersMax: '字符长度不能大于%d',
    charactersOnlyLetter: '请输入英文字母',
  },
  afcInput: {
    emailFormat: '电子邮件格式不正确',
    urlFormat: 'url格式不正确',
  },
};
