var MongoClient = require('mongodb').MongoClient;
var clog = require('clog');
var util = require('util');

clog.configure({'log level': 5});
//로그레벨 5개

//{'log': true, 'info': true, 'warn': true, 'error': true, 'debug': true}

/* clog 로그 레벨별 출력 메세지
switch(logLevel){
	default:
	case 5:
	"debug";
	case 4:
	"error";
	case 3:
	"warn";
	case 2:
	"info";
	case 1:
	"log";
	break;
}
*/

var db;

// DB 접속
const url = 'mongodb://localhost:27017';
const dbName = 'mulpang';
MongoClient.connect(url, function(err, client) {
  if(err) clog.error(err);
  clog.log("Connected successfully to server");
  db = client.db(dbName);
  //db.dropDatabase();

  db.board = db.collection('board');
  db.coupon = db.collection('coupon');

  setTimeout(function(){
    client.close();


  }, 2000);

  todo11();


});

// 등록할 게시물
var b1 = {no: 1, name: "admin", title: "[공지]게시판 사용규칙 안내입니다.", content: "잘 쓰세요."};
var b2 = {no: 2, name: "kim", title: "첫번째 글을 올리네요.", content: "잘 보이나요?"};
var b3 = {no: 3, name: "lee", title: "그렇다면 두번째 글은...", content: "잘 보이겠죠?"};

// 로그 메세지 출력
function myLog(str, result){
  clog.info(str);
  //배열을 보기좋게 문자열함수로 만들어서..
	clog.debug(util.inspect(result,{depth : 5}) + "\n");
}

// TODO 1. board 컬렉션에 데이터 등록
// insertOne({등록할 문서}), insertMany([{등록할 문서}, {등록할 문서}])
function todo1(){
  //반드시 첫번째가 끝나고 두번재를 시켜라.. 그러면 1이 완벽하게 끝나야 2를 실행함..그럼 순ㅅㅓ를 보장할수 있다
  //그럼계속 콜백함수를 호출해야함 ..
  db.board.insertOne(b1, function(){
    db.board.insertMany([b2, b3], function(){
      todo2();
    });

  });
  

}

// TODO 2. 모든 board 데이터의 모든 속성 조회
// find()
function todo2(){
	db.board.find().toArray(function(err, result){

   myLog('TODO 2. 모든 board 데이터의 모든 속성 조회', result);
   todo3(); 
  });
}

// TODO 3. 데이터 조회(kim이 작성한 게시물 조회)
// find({검색조건})
function todo3(){
  //toArray를 썼기때문ㅇ ㅔ1건이나와도 배열이다
  db.board.find({name : 'kim'}).toArray(function(err, result){

    myLog('TODO 3. 데이터 조회(kim이 작성한 게시물 조회)', result);
    todo4(); 
   });
	
}

// TODO 4. 모든 board 데이터의 작성자 속성만 조회(_id 포함)
// find({검색조건}, {projection: {출력컬럼}})
function todo4(){
  //모든 데이터, name : true면 꺼내겠다
  db.board.find({}, {projection: {name : 1}}).toArray(function(err, result){

    myLog('TODO 4. 모든 board 데이터의 작성자 속성만 조회(_id 포함)', result);
    todo5(); 
   });
	
}

// TODO 5. kim이 작성한 게시물의 제목 조회(_id 미포함)
// find({검색조건}, {projection: {출력컬럼}})
function todo5(){
  //꺼내기싫은건 0(false), 꺼내고싶은건 1 (true)
  db.board.find({name : 'kim'}, {projection: {_id : 0, title : 1}}).toArray(function(err, result){

    myLog('TODO 5. kim이 작성한 게시물의 제목 조회(_id 미포함)', result);
    todo6(); 
   });
	
}

// TODO 6. 첫번째 게시물 조회(1건)
// findOne()
function todo6(){

  db.board.findOne(function(err, result){
    myLog('TODO 6. 첫번째 게시물 조회(1건)', result);
    todo7();
  });
	
}

// TODO 7. 게시물 조회(lee가 작성한 데이터 1건 조회)
// findOne({검색조건})
function todo7(){
  //콜백함수는 항상 마지막 인자값으로 ..
  db.board.findOne({name : 'lee'},function(err, result){
    myLog('TODO 7. 게시물 조회(lee가 작성한 데이터 1건 조회)', result);
    todo8();
  });
	
}

// TODO 8. 게시물 수정(3번 게시물의 내용 수정)
// updateOne({검색조건}, {수정할 문서})
function todo8(){
  db.board.updateOne({no:3},{$set:{content: '수정함.'} } , function(err, result){
    list('TODO 8. 게시물 수정(3번 게시물의 내용 수정)', todo9); //다시한번 find해서 찾아야하니까 


  });
  
}

// 전체 게시물을 조회하여 지정한 문자열을 출력하고
// next 함수를 호출한다.
function list(str, next){
	db.board.find().toArray(function(err, result){
		myLog(str, result);
		if(next){
			next();
		}
	});
}

// TODO 9. 1번 게시물에 댓글 추가
function todo9(){
	var comment = {
    name: '이영희',
    content: '퍼가요~~~'
  };
  db.board.updateOne({no:1}, {$push:{comments : comment}}, function(){
    list('TODO 9. 1번 게시물에 댓글 추가', todo10);
  });
  
}

// TODO 10. 2번 게시물 삭제
// deleteOne({검색 조건})
function todo10(){
  db.board.deleteOne({no :2}, function(){
    list('TODO 10. 2번 게시물 삭제', todo11);
  });
	
}

// TODO 11. mulpang DB coupon collection의 모든 쿠폰 목록을 조회한다.
// 쿠폰명, 판매 시작일만 출력한다.
// 판매시작일의 내림차순으로 정렬한다. - >project 추가
// ->특수문자들어가면 ''로 묶어줘야
// 2페이지의 5건만 조회  - > 다섯개 건너뛰고 그 다음 다섯개 6~10번까지 출력해라 ..
function todo11(){
  db.coupon.find()
  .project({couponName : 1, 'saleDate.start':1, _id:0})
  .sort({'saleDate.start':-1})
  .skip(5)
  .limit(5)
  .toArray(function(err, data){
    myLog('TODO 11. mulpang DB coupon collection의 모든 쿠폰 목록을 조회한다.',data);
  });


}






































