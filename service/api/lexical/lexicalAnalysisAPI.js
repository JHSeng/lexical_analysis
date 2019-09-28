/* eslint-disable camelcase */
/* eslint-disable new-cap */
const express = require("express");
const generateNFA = require("./generateNFA");
const generateTree = require("./generateTree"); // 导入 generateTree.js
const generateDFA = require("./generateDFA");
const simplifyDFA = require("./simplifyDFA");
const generateCode = require("./generate_nfa_code");
const addSemantic = require("./regularExpressionAddSemantic.js");

const router = express.Router();
const tool = require("./tool");

// res 是 response 对象，req 是 request 对象
// express 的回调函数
const jsonWrite = function (res, req) {
  if (typeof req === "undefined") {
    res.send("err");
  } else {
    // console.log(ret);
    res.send(req);
  }
};
// var dateStr = function(str) {
//   return new Date(str.slice(0,7));
// }

// 生成NFA接口
router.post("/regularExpression", (req, res) => {
  let state = 1;
  const params = req.body;
  const expressions = params.RE; // 获得前端传来的正则表达式
  const NFA = new generateNFA(expressions);
  // 正则表达式语法出错，错误信息在 NFA.message 中
  if (NFA.state === 0) {
    state = 0;
    jsonWrite(res, { state: state, message: NFA.message });
  } else {
    // 正则表达式没问题，但是正则表达式为空
    if (NFA.result.alphabet.length === 1 && NFA.result.alphabet[0] === "ε") {
      state = 0;
      jsonWrite(res, { state: state, message: "NFA is null." });
    } else {
      const newRegular = new addSemantic(expressions); // 给正则表达式加括号
      const tree = new generateTree(newRegular.result); // 生成分步展示对应的树
      const NFATree = tree.result; // 生成分步展示对应的树
      const DFA = new generateDFA(NFA.result);
      const s_DFA = new simplifyDFA(DFA);
      // 后端传给前端的 NFA 数据。一个三维的状态转换表，一个字母表，一个接受状态表
      const NFAdata = {
        transitionTable: tool(NFA.result),
        alphabet: NFA.result.alphabet,
        acceptStateList: NFA.result.acceptStateList
      };
      // 后端传给前端的 DFA 数据。暂时还不知道是什么
      const DFAdata = {
        transitionTable: tool(DFA),
        alphabet: DFA.alphabet,
        acceptStateList: DFA.acceptStateList
      };
      // 后段传给前端的化简后的 DFA 数据。暂时还不知道是什么
      const S_DFAdata = {
        transitionTable: tool(s_DFA),
        alphabet: s_DFA.alphabet,
        acceptStateList: s_DFA.acceptStateList
      };
      // 生成 NFA DFA SimpleDFA 对应的代码。
      const NFAcode = generateCode(NFAdata);
      const DFAcode = generateCode(DFAdata);
      const S_DFAcode = generateCode(S_DFAdata);

      const code = [NFAcode, DFAcode, S_DFAcode];
      const result = [NFAdata, DFAdata, S_DFAdata, NFATree]; // 增加 NFATree
      console.log("---------------------------------------------------");
      console.log(code[0]);
      console.log("---------------------------------------------------");
      console.log(code[1]);
      console.log("---------------------------------------------------");
      console.log(code[2]);
      console.log("---------------------------------------------------");
      console.log(DFAdata);
      jsonWrite(res, { state: state, result: result, code: code });
    }
  }
});

module.exports = router;
