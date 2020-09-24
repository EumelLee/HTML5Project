// 프로필 이미지를 업로드 한다.
function uploadProfileImage(){
	// 파일을 선택한 후에 파일 선택을 취소했을 경우
	if(this.files.length == 0) return;
	
	var progress = $('.form_section > form progress');
	
	// XMLHttpRequest 객체 생성
	var xhr = new XMLHttpRequest();
	
	// 업로드 시작시 발생
	xhr.upload.onloadstart = function(){
		progress.val(0).show();
	};
	
	// 업로드 도중에 계속 발생
	xhr.upload.onprogress = function(e){
		progress.val(e.loaded / e.total);
	};
	
	// 업로드 종료 시 발생
	xhr.upload.onload = function(){
		progress.hide();
	};
	
	// 서버의 응답 완료시 발생
	// 프로필 이미지를 업로드 하면 서버에서는 임시로 만들어지는 파일명을 응답으로 넘겨준다.
	xhr.onload = function(){
		var tmpFileName = xhr.responseText;
		$('.form_section > form')[0].tmpFileName.value = tmpFileName;
		$('.form_section > form img').attr('src', '/tmp/' + tmpFileName); //일단 임시파일로.. 파일만 올리고 가입 안할수도 있으니까 
	};	
	
	// 선택한 프로필 이미지를 서버로 업로드한다. form 데이터를 만들어서 파일을 지정해서 첨부해서 전송할수있다.
	var formData = new FormData();
	formData.append('profile', this.files[0]);
	
	xhr.open('post', '/users/profileUpload', true);
	xhr.send(formData);
}