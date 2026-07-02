if(
localStorage.getItem("dangNhap")
!== "true"
){

    window.location.href =
    "login.html";

}

const ten =
localStorage.getItem("hoTen");

const lop =
localStorage.getItem("lopThiSinh");

const btn =
document.getElementById(
"taiKhoanBtn"
);

if(btn){

    btn.innerHTML =
    ten + " ▼";

}

const tenHocSinh =
document.getElementById(
"tenHocSinh"
);

if(tenHocSinh){

    tenHocSinh.innerHTML =
    "Xin chào, " + ten;

}

const lopHocSinh =
document.getElementById(
"lopHocSinh"
);

if(lopHocSinh){

    lopHocSinh.innerHTML =
    "Lớp: " + lop;

}

function dangXuat(){

    localStorage.clear();

    window.location.href =
    "index.html";

}