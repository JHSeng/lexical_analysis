var addSemantic=require('./regularExpressionAddSemantic.js');
var generateNFA=require('./generateNFA.js');
var tool =require("./tool.js");
//运算符优先级表
var OperatorInformationTable=[
  {operator:'(',priority:0,numOfParams:0},
  {operator:'[',priority:0,numOfParams:0},
  {operator:'|',priority:1,numOfParams:2},
  {operator:'..',priority:2,numOfParams:2},
  //不是单目运算符根据优先级压入
  //是单目运算符直接弹出
  {operator:'*',priority:3,numOfParams:1},
  {operator:'+',priority:3,numOfParams:1},
  {operator:'{',priority:3,numOfParams:1},
  {operator:'?',priority:3,numOfParams:1},
  {operator:')',priority:4,numOfParams:0},
  {operator:']',priority:4,numOfParams:0},
  {operator:'}',priority:4,numOfParams:1},
  {operator:'\\',priority:0,numOfParams:1},
  {operator:'<',priority:0,numOfParams:0},  //人工添加的左括号
  {operator:'>',priority:4,numOFParams:0}  //人工添加的右括号
]
//合法字母表
var MiddlePackageAlphabet=[
  '0','1','2','3','4','5','6','7','8','9',
  'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
  'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
]

//返回字符在 MiddlePackageAlphabet 中的下标
function IndexChar(char) {
  var Index=-1;//若不在MiddlePackageAlphabet中，则返回一
  for(var i=0;i<MiddlePackageAlphabet.length;i++)
  {
    if(MiddlePackageAlphabet[i]==char) {Index=i;break;}
  }
  return Index
}
//返回运算符优先级
function Priority(char){
  var priority=-1;//常规字符优先级为-1
  for(var i=0;i<OperatorInformationTable.length;i++)
  {
    if(char==OperatorInformationTable[i].operator){priority=OperatorInformationTable[i].priority;break;}
  }
  return priority;
}
//返回运算符参数目数
function NumOfParams(char){
  var numOfParams=-1;//常规字符为-1
  for(var i=0;i<OperatorInformationTable.length;i++)
  {
    if(char==OperatorInformationTable[i].operator){numOfParams=OperatorInformationTable[i].numOfParams;break;}
  }
  return numOfParams;
}

//Node 对象
var node=function(id,str,leftId=-1,rightId=-1){
  this.id=id;  //该节点ID
  this.str=str;  //该节点对应的正则表达式
  this.leftId=leftId;  //此节点的左子节点的ID
  this.rightId=rightId;  //此节点的右子节点的ID
  this.NFA={
    alphabet:[],  //字母表
    acceptStateList:[],  //接受状态表
    stateTransitionArray:[]  //三维状态转换数组
  };  //该节点对应的 NFA
  this.stateTransition=new Array();  //状态转换表
  this.printNode=printNode;  //打印该节点
  this.leafOrNot=leafOrNot;  //判断该节点是不是一个叶子节点
  this.getStr=getStr;
}
function leafOrNot(){
  //如果此节点的左子节点的ID等于-1，并且右子节点的ID等于-1，则结点是一个叶子节点
  if(this.leftId===-1 && this.rightId===-1){
    return true;
  }
  else{
    return false;
  }
}
function printNode(){
  console.log(this.id,this.str,this.leftId,this.rightId);
  // console.log(this.NFA);
  console.log(this.NFA.alphabet);
  console.log(this.NFA.stateTransitionArray);
  console.log(this.NFA.acceptStateList);
}
function getStr(){
  return this.str;
}

//Tree 对象
var tree=function(){
  this.dataStore=new Array();  //一个数组，储存 node 对象的实例
  this.push=add;  //向 tree 中添加 node 对象的实例
  this.remove=dele;  //从 tree 中删除 node 对象的实例，通过下标删除
  this.getNode=getNode;  //通过下标，索引 node 对象的实例
  this.printTree=printTree;  //打印这棵树
  this.clean=clean;  //清理这棵树，把相似的节点删除
}
function add(el){
  this.dataStore.push(el);
}
function dele(index){
  this.dataStore.splice(index,1);
}
function getNode(index){
  return this.dataStore[index];
}
function printTree(){
  for(let i=0;i<this.dataStore.length;i++){
    this.dataStore[i].printNode();
  }
}
function clean(){
  var tempDataStore=this.dataStore;
  for(let i=0;i<this.dataStore.length-1;){
    var temp1='('+tempDataStore[i].getStr()+')';
    var temp2=tempDataStore[i+1].getStr();
    if(temp1===temp2){
      tempDataStore.splice(i,1);
      i+=1;
    }
    else{
      i++;
    }
  }
  this.dataStore=tempDataStore;
}


// Stack 对象
var Stack = function(){
  this.dataStore=[];
  this.pop=pop;
  this.top=top;
  this.push=push;
  this.nullOrNot=nullOrNot;
}
//出栈，栈长度减一，同时返回栈顶元素
function pop(){
  //console.log(this.dataStore.length)
  var temp = this.dataStore[this.dataStore.length-1];
  this.dataStore.length = this.dataStore.length-1;
  return temp;
}
//获得栈顶元素
function top(){
  return this.dataStore[this.dataStore.length-1];
}
//压栈
function push(el){
  this.dataStore[this.dataStore.length]=el
}
//判断栈是否为空
function nullOrNot(){
  //null则返回true
  if(this.dataStore.length==0){
    return true
  }
  else{
    return false
  }
}

//  由一个完整正则表达式生成的 signalTree 对象，输入参数 str 是一个完整的正则表达式
var singalTree =function(str){

  //属性
  this.regularString=str; // Tree 对应的正则表达式
  this.strStack=new Stack(); // 初始化一个字符串栈，最终字符串栈中只剩一个最后的字符串，就是这条完整的正则表达式
  this.operatorStack=new Stack();  // 初始化一个运算符栈，最终运算符栈为空
  this.recordNode=new Map();  //一个 Map，键是字符串，值是该字符串的 ID
  this.tree=new tree();  //用于储存分步的小 NFA

  //函数
  this.generateTree=generateTree;  //生成树
  this.generateTreeFirst=generateTreeFirst;  //生成树的第一步，将基本字符串取出来作为最下面的叶子节点。
  this.generateTreeSecond=generateTreeSecond;  //生成树的第二步，进行常规的压栈操作，但是，在运算符执行时有修改
  this.operatorPerform=operatorPerform;  //生成树的第三步，运算符出栈并执行
  this.connectOperator=connectOperator;  // '..' 连接运算符
  this.selectOperator=selectOperator;  // '|' 选择运算符
  this.clodureOperator=clodureOperator;  // '*' Kleene 闭包运算符
  this.questionMarkOperator=questionMarkOperator;  // '?' 运算符
  this.addOperator=addOperator;  // '+' 运算符
  this.getRegulaArray=getRegulaArray; //得到一条正则表达式拆成的多条正则表达式组成的数组
  this.generateNodeNFA=generateNodeNFA;  //生成树的第四步，对每个节点都构建NFA
}
//生成树
function generateTree(){
  var stateJudge=this.generateTreeFirst();
  if(stateJudge.state===0){
    return stateJudge;
  }
  else{
    stateJudge=this.generateTreeSecond();
  }
  if(stateJudge.state===0){
    return stateJudge;
  }
  else{
    stateJudge=this.operatorPerform();
  }
  if(stateJudge.state===0){
    return stateJudge;
  }
  else{
    stateJudge=this.generateNodeNFA();
  }
  if(stateJudge.state===0){
    return stateJudge;
  }
  else{
    return { state:1 , message:""};
  }
}
//对每个节点都构建NFA
function generateNodeNFA(){
  this.tree.clean();  //第一步，先清理树中的冗余
  for(let i=0;i<this.tree.dataStore.length;i++){
    var tempStr=[this.tree.dataStore[i].getStr()];
    var tempNFA=new generateNFA(tempStr);  //tempStr 应该是一个数组！！
    if(tempNFA.state===0){
      return {state:tempNFA.state,message:tempNFA.message};
    }
    else{
      if(tempNFA.result.alphabet.length===1 && tempNFA.result.alphabet[0]==='ε'){
        return {state:0,message:"NFA is null."};
      }
      else{
        this.tree.dataStore[i].stateTransition=tempNFA.result.stateTransition;
        this.tree.dataStore[i].NFA.alphabet=tempNFA.result.alphabet;
        this.tree.dataStore[i].NFA.acceptStateList=tempNFA.result.acceptStateList;
        this.tree.dataStore[i].NFA.stateTransitionArray=tool(tempNFA.result);
      }
    }
  }
  return { state:1 , message:""};
}
//生成树的第一步
function generateTreeFirst(){
  var str=this.regularString;
  for(let i=0; i<str.length;){
    var currentChar=str[i];
    switch(NumOfParams(currentChar)){
      case -1:  //常规字符
        var tempNode=new node(this.tree.dataStore.length,currentChar);  //声明一个节点存储这个常规字符
        this.recordNode.set(tempNode.str,tempNode.id);  //将节点的字符串和 ID 记录下来，
        this.tree.push(tempNode);  //将这个节点加到树里面
        ++i;  //当前位置向后移一位
        break;
      case 1:  //这里只考虑转义字符‘\’和‘{}’
        if(currentChar==='\\'){
          var next=i+1;
          if(Priority(str[next])>=0){  //转义字符后面跟的是运算符
            let tempNode=new node(this.tree.dataStore.length,currentChar+str[next]);  //声明一个节点储存这个转义字符和被转义的运算符
            this.recordNode.set(tempNode.str,tempNode.id);  //将节点的字符串和 ID 记录下来
            this.tree.push(tempNode);  //将节点添加到树里面
            i=next+1;  //当前位置后移两位
          }
          else if(str[next]==='d'){  //转义字符后面是常规字符 'd'
            let tempNode= new node(this.tree.dataStore.length,currentChar+str[next]);  //声明一个节点储存字符串 '\d'
            this.recordNode.set(tempNode.str,tempNode.id);  //将节点的字符串和 ID 记录下来
            this.tree.push(tempNode);  //将节点添加进树里面
            i=next+1;  //当前位置后移两位
          }
          else{  //转义字符后面的字符不合法
            return {state:0,message:"Invalid char after \'\\\'"};
          }
        }
        else if(currentChar==='{'){  //遇到这个字符，先找到与之匹配的‘}’,然后将这一串字符跳过
          while(str[i]!='}'){
            ++i;
          }
          ++i;
        }
        else{
          ++i;
        }
        break;
      case 0:  //这里只考虑操作符 '['，到达这里的正则表达式都是正确的，因为前面已经检查过正则表达式的正确性了。这里就不在检查括号的匹配情况
        if(currentChar==='['){
          let tempStr="";  //变量 tempStr 储存字符串 '[...]'
          for(;str[i]!=']';++i){
            tempStr+=str[i];
          }
          tempStr+=str[i];
          let tempNode=new node(this.tree.dataStore.length,tempStr);
          this.recordNode.set(tempNode.str,tempNode.id);
          this.tree.push(tempNode);
          ++i;  //当前位置向后移一位
        }
        else{
          ++i;
        }
        break;
      default:
        ++i;
    }
  }
  return { state:1 , message:""};
}
//生成树的第二步
function generateTreeSecond(){
  var str=this.regularString;
  for(let i=0;i<str.length;++i){
    var currentChar=str[i];
    switch(NumOfParams(currentChar)){
      case -1:  //常规字符
        this.strStack.push(currentChar);  //字符串栈中压入当前字符
        //向前看一个字符，如果下一个字符的优先级小于等于0，则在运算符栈中压入一个连接运算符‘..’
        if(i+1<str.length && Priority(str[i+1])<=0){
          this.operatorStack.push('..');  //运算符栈中压入连接运算符‘..’
        }
        break;
      case 0:  //运算符‘(’、运算符‘)’、运算符‘[’和运算符‘]’
        switch(currentChar){
          case '(':
            //如果下一个字符是‘)’，则将‘()’视为一个常规字符处理
            if(i+1<str.length && str[i+1]===')'){
              let tempNode=new node(this.tree.dataStore.length,currentChar+str[i+1]);
              this.recordNode.set(tempNode.str,tempNode.id);
              this.tree.push(tempNode);
              i++;  //当前位置后移一位
              //向前看一个字符，如果下一个字符的优先级小于等于0，则在运算符栈中压入一个连接运算符‘..’
              if(i+1<str.length && Priority(str[i+1])<=0){
                this.operatorStack.push('..');  //运算符栈中压入连接运算符‘..’
              }
            }
            else{  //将‘(’视为运算符
              this.operatorStack.push('(');
            }
            break;
          case ')':  //遇到了‘)’，此运算符不压栈。运算符栈和字符串栈都不压进去
            //while 循环结束时，代表一个小括号中的正则表达式处理完毕
            while(!this.operatorStack.nullOrNot()){
              //运算符栈弹栈，遇到‘(’停止
              let tempOperator=this.operatorStack.top();
              if(tempOperator!='('){
                switch(tempOperator){
                  case '|':
                    this.selectOperator();
                    break;
                  case '..':
                    this.connectOperator();
                    break;
                }
              }
              else{  //运算符栈栈顶是‘(’
                this.operatorStack.pop();
                break;
              }
            }
            var temp1=this.strStack.pop();  //取出字符串栈的栈顶，栈顶字符串是小括号里面的内容，在该字符串两端加上小括号后，再压回字符串栈
            var tempId=this.recordNode.get(temp1);  //得到该字符串对应的 ID
            tempStr='('+temp1+')';  //在该字符串两端加上小括号
            this.strStack.push(tempStr);  //把添加了小括号的字符串压回字符串栈中
            var tempLeftId=this.tree.getNode(tempId).leftId;  //记录没加括号的字符串的 leftId
            var tempRightId=this.tree.getNode(tempId).rightId;  //记录没加括号的字符串的 rightId
            // this.recordNode.delete(temp1);  //将没加括号的字符串从记录中删除
            // this.tree.remove(tempId);  //将没加括号的字符串从树中删除
            var tempNode=new node(this.tree.dataStore.length,tempStr,tempLeftId,tempRightId)  //创建一个新的节点，储存加了括号的字符串
            this.recordNode.set(tempNode.str,tempNode.id);  //记录这个新的节点
            this.tree.push(tempNode);  //将新的节点加到树里面
            //向前看一个字符，如果下一个字符的优先级小于等于0，则在运算符栈中压入一个连接运算符‘..’
            if(i+1<str.length && Priority(str[i+1])<=0){
              this.operatorStack.push('..');  //运算符栈中压入连接运算符‘..’
            }
            break;
          case '[':
            var tempStr="";
            for(;str[i]!=']';++i){  //将当前位置移至 ']' 这里，这里就不检查是否有匹配的 ']' 了，因为前面已经检查过了，
              tempStr+=str[i]
            }
            tempStr+=str[i];
            this.strStack.push(tempStr);  //把这个字符串视为常规字符处理，只压进栈就好
            //向前看一个字符，如果下一个字符的优先级小于等于0，则在运算符栈中压入一个连接运算符‘..’
            if(i+1<str.length && Priority(str[i+1])<=0){
              this.operatorStack.push('..');  //运算符栈中压入连接运算符‘..’
            }
            break;
          case ']':
            return {state:0,message:"single \'\]\'."}
            break;
        }
        break;
      case 1:  //单目运算符，不入运算符栈 '*' '+' '?' '{' '}' '\'
        switch (currentChar){
          case '\\':
            var tempStr="\\";
            //这里就不检查转义字符后面的字符是否合法了，以为前面已经检查了
            ++i;  //将当前位置指向转义字符后面的字符
            tempStr+=str[i];
            this.strStack.push(tempStr);  //这里简单的把字符串压入字符串栈里就好
            //向前看一个字符，如果下一个字符的优先级小于等于0，则在运算符栈中压入一个连接运算符‘..’
            if(i+1<str.length && Priority(str[i+1])<=0){
              this.operatorStack.push('..');  //运算符栈中压入连接运算符‘..’
            }
            break;
          case '*':
            this.clodureOperator();  //执行克林闭包运算
            //向前看一个字符，如果下一个字符的优先级小于等于0，则在运算符栈中压入一个连接运算符‘..’
            if(i+1<str.length && Priority(str[i+1])<=0){
              this.operatorStack.push('..');  //运算符栈中压入连接运算符‘..’
            }
            break;
          case '+':
            this.addOperator();
            //向前看一个字符，如果下一个字符的优先级小于等于0，则在运算符栈中压入一个连接运算符‘..’
            if(i+1<str.length && Priority(str[i+1])<=0){
              this.operatorStack.push('..');  //运算符栈中压入连接运算符‘..’
            }
            break;
          case '?':
            this.questionMarkOperator();
            //向前看一个字符，如果下一个字符的优先级小于等于0，则在运算符栈中压入一个连接运算符‘..’
            if(i+1<str.length && Priority(str[i+1])<=0){
              this.operatorStack.push('..');  //运算符栈中压入连接运算符‘..’
            }
            break;
          case '{':  //这里就不检查是否有匹配的‘}’了，因为前面已经检查过了。
            var tempStr="{";
            while(str[i]!='}'){
              ++i;
              tempStr+=str[i];
            }
            tempStr=this.strStack.top()+tempStr;  //将字符串栈栈顶元素和 '{...}' 组合起来
            var tempNode=new node(this.tree.dataStore.length,tempStr,this.recordNode.get(this.strStack.top()));  //声明一个新的节点，储存该字符串
            this.recordNode.set(tempNode.str,tempNode.id);  //将该字符串记录下来
            this.tree.push(tempNode);  //将该字符串添加到树里面
            this.strStack.pop();  //将栈顶元素弹出
            this.strStack.push(tempStr);  //将该字符串压入字符串栈中
            //向前看一个字符，如果下一个字符的优先级小于等于0，则在运算符栈中压入一个连接运算符‘..’
            if(i+1<str.length && Priority(str[i+1])<=0){
              this.operatorStack.push('..');  //运算符栈中压入连接运算符‘..’
            }
            break;
          case '}':
            return {state:0,message:"single \'\}\'."}
            break;
        }
        break;
      case 2:  //运算符‘..’和运算符‘|’。先将运算符栈内比自身优先级高的运算符弹出，然后再入栈
        var priorityCurrent=Priority(currentChar);
        var priorityTop=Priority(this.operatorStack.top());
        while(!this.operatorStack.nullOrNot() && priorityTop>priorityCurrent){
          //运算符栈栈顶运算符优先级比当前运算符优先级高
          switch(this.operatorStack.top()){
            case '..':
              this.connectOperator();
              break;
            case '|':
              this.selectOperator();
              break;
          }
          priorityTop=Priority(this.operatorStack.top());
        }
        this.operatorStack.push(currentChar);
        break;
    }
  }
  return {state:1,message:""}  //正则表达式语法没问题
}
//运算符弹出并执行
function operatorPerform() {
  while(!this.operatorStack.nullOrNot()){
    var operator =this.operatorStack.top();
    switch(operator){
      case '..':
        this.connectOperator()
        break;
      case '|':
        this.selectOperator()
        break;
      case '(':
        return{state:0,message:"singal \'\(\'"}  //正则表达式语法错误
        break;
    }
  }
  return { state:1 , message:""};
}
// '..' 运算符
function connectOperator(){
  //取出字符串栈最上面的两个元素
  var temp1=this.strStack.pop();
  var temp2=this.strStack.pop();
  var tempStr= temp2+temp1;  //将两个字符串直接连接起来
  this.strStack.push(tempStr);  //将连接好的字符串再压回去
  var tempNode=new node(this.tree.dataStore.length,tempStr,this.recordNode.get(temp2),this.recordNode.get(temp1));  //声明新的节点储存这个新的字符串
  this.recordNode.set(tempNode.str,tempNode.id);  //记录这个新的字符串
  this.tree.push(tempNode);  //将这个新的字符串加到树里面
  this.operatorStack.pop(); //从运算符栈中抛出连接运算符 '..'
}
// '|' 运算符
function selectOperator(){
  //取出字符串栈最上面的两个元素
  var temp1=this.strStack.pop();
  var temp2=this.strStack.pop();
  var tempStr= temp2+'|'+temp1;  //将两个字符串用或运算符‘|’连接起来
  this.strStack.push(tempStr);  //将连接好的字符串再压回去
  var tempNode=new node(this.tree.dataStore.length,tempStr,this.recordNode.get(temp2),this.recordNode.get(temp1));  //声明新的节点储存这个新的字符串
  this.recordNode.set(tempNode.str,tempNode.id);  //记录这个新的字符串
  this.tree.push(tempNode);  //将这个新的字符串加到树里面
  this.operatorStack.pop(); //从运算符栈中抛出选择运算符 '|'
}
// '*' 运算符
function clodureOperator(){
  var temp1=this.strStack.pop();  //取得字符串栈栈顶元素
  var tempStr=temp1+'*';  //将栈顶元素加上运算符‘*’
  this.strStack.push(tempStr);  //将新的字符串再压回去
  var tempNode=new node(this.tree.dataStore.length,tempStr,this.recordNode.get(temp1));  //声明新的节点储存这个新的字符串
  this.recordNode.set(tempNode.str,tempNode.id);  //记录这个新的字符串
  this.tree.push(tempNode);  //将这个新的字符串加到树里面
}
// '+' 运算符
function addOperator(){
  var temp1=this.strStack.pop();  //取得字符串栈栈顶元素
  var tempStr=temp1+'+';  //将栈顶元素加上运算符‘+’
  this.strStack.push(tempStr);  //将新的字符串再压回去
  var tempNode=new node(this.tree.dataStore.length,tempStr,this.recordNode.get(temp1));  //声明新的节点储存这个新的字符串
  this.recordNode.set(tempNode.str,tempNode.id);  //记录这个新的字符串
  this.tree.push(tempNode);  //将这个新的字符串加到树里面
}
// '?' 运算符
function questionMarkOperator(){
  var temp1=this.strStack.pop();  //取得字符串栈栈顶元素
  var tempStr=temp1+'?';  //将栈顶元素加上运算符‘?’
  this.strStack.push(tempStr);  //将新的字符串再压回去
  var tempNode=new node(this.tree.dataStore.length,tempStr,this.recordNode.get(temp1));  //声明新的节点储存这个新的字符串
  this.recordNode.set(tempNode.str,tempNode.id);  //记录这个新的字符串
  this.tree.push(tempNode);  //将这个新的字符串加到树里面
}
//得到一条正则表达式拆成的多条正则表达式组成的数组
function getRegulaArray(){
  var regulaArray=new Array();
  for(let i=0;i<this.tree.dataStore.length;++i){
    var tempStr=this.tree.dataStore[i].getStr();
    regulaArray.push(tempStr);
  }
  return regulaArray
}

// //测试 singalTree
// var regualStr=
//   ['(ab)fgs*|ghl{1,2}'];
//   // ['asddfa*a+a?a{1,2}\\d\\+[as]|(as)*hjkl(as)+(a*a+a?a{1,2}|\\d\\+[as])?(as){1,2}'];
// var newRegular=new addSemantic(regualStr);
// console.log(newRegular.result[0]);
// console.log('1111111');
// var test=new singalTree(newRegular.result[0]);
// test.generateTree();
// // test.generateTreeFirst();
// // test.generateTreeSecond();
// // test.operatorPerform();
// // test.tree.clean();
// console.log(test.getRegulaArray());
// console.log('1111111');
// test.tree.printTree();

//finalTree 对象。输入参数是用户在前端输入的正则表达式数组，包含多条正则表达式
var finalTree=function(strArray){
  this.strArray=strArray;  // 正则表达式数组，存储多条正则表达式
  this.tree=new tree();  //一组正则表达式对应的大树
  this.generateFinalTree=generateFinalTree;  //生成最终的那棵大树
}
//生成最终的那棵大树
function generateFinalTree() {
  var bigStr=this.strArray[0];  //将一组正则表达式用或运算符连接起来
  for (var i = 1; i < this.strArray.length; i++){
    bigStr=bigStr+'|'+this.strArray[i];
  }
  var tempSingalTree=new singalTree(bigStr);  //将连接起来的正则表达式生成树
  var tempState=tempSingalTree.generateTree();  //判断生成树是否成功
  if(tempState.state===0){
    return tempState;
  }
  else{
    this.tree=tempSingalTree.tree;
    return { state:1 , message:""};
  }
}

// //测试 finalTree
// // var testArray=['ab','s+m'];
// // var newRegularArray=new addSemantic(testArray);
// // console.log(newRegularArray.result);
// // var test=new finalTree(newRegularArray.result);
// // test.generateFinalTree();
// // test.tree.printTree();

// generateTree.js 模块的返回函数
module.exports = function(strArray) {
  var test = new finalTree(strArray)
  var stateReturn = test.generateFinalTree()
  if( stateReturn.state === 0 ){  // 正则表达式语法出错，生成树失败，返回一个对象的实例，{state:0,message:"error message"}
    return stateReturn
  }
  else{  // 由正则表达式生成树成功 stateReturn.state === 1
    return {state:stateReturn.state,message:stateReturn.message,result:test.tree};
  }
}

