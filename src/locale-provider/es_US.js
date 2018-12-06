//afc前缀是antd-form-component的首字母缩写
//避免跟antd的命名重复
export default {
  afcCommon: {
    isRequired: '请输入%s',
    //中文字符算两个英文字符
    charactersBetwteen: '请输入%d到%d个字符',
    charactersMin: '不能小于%d个字符',
    charactersMax: '不能大于%d个字符',
    charactersOnlyLetter: '只允许输入英文字母',
    charactersOnlyChinese: '只允许输入中文',
  },
  afcInput: {
    emailFormat: '电子邮件格式不正确',
    urlFormat: 'url格式不正确',
    formatErrorMsg: '必须是字母和数字结合',
  },
  afcPassword: {
    checkLabel: '确认密码',
    checkErrorMsg: '您两次输入的密码不一致',
  },
};
