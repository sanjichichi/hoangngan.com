/*=========================================================
        TRANG CÁ NHÂN - OLYMPIC HSG
=========================================================*/

//=======================
// GOOGLE SHEETS
//=======================

const sheetURLs = {

    "Olympic Toán 2026":
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpyBmphKKF3lC2YXtIAU7GZO0R7te1Orvoi8KqmHx-PbMKfl2r8iNwz5Z5PA2iUr5ol9A1-AraIMvi/pub?output=csv",

    "Olympic Ngữ văn 2026":
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTQi1mhGw-K9xsKeYgqpe-n3XvALt-PcPb-oOkVxHJ2CLhyfy9QlzkgWnNK24zjQCWmO5q_YuMy5Sga/pub?output=csv",

    "Olympic Tiếng Anh 2026":
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQtvs9nZ-1ab-DR-rekNM37FXv65Xz8va5RX-98kdy6kbCRrIZIaeO5GgPDZDZdklho2Wk2OuJx-yzZ/pub?output=csv",

    "Olympic 2026":
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vT1XU2cW4LBuNHihn58r7svCjjtN06q_1e6BndfbPH6yja2nHhadihWkZIBzr7CSnWO5YLeGxMneJJK/pub?output=csv"

};


//=======================
// LOCAL STORAGE
//=======================

const maHS =
localStorage.getItem("maThiSinh") || "";

const hoTen =
localStorage.getItem("hoTen") ||
localStorage.getItem("tenThiSinh") || "";

const lop =
localStorage.getItem("lopThiSinh") || "";

const ngaySinh =
localStorage.getItem("ngaySinh") || "";

const truong =
localStorage.getItem("truong") || "";


//=======================
// KIỂM TRA ĐĂNG NHẬP
//=======================

if(maHS===""){

    alert("Bạn chưa đăng nhập!");

    window.location="login.html";

}


//=======================
// HIỂN THỊ THÔNG TIN
//=======================

document.getElementById("hoTen").innerText=hoTen;

document.getElementById("maHS").innerText=maHS;

document.getElementById("lop").innerText=lop;

document.getElementById("ngaySinh").innerText=ngaySinh;

document.getElementById("gioiTinh").innerText =
    localStorage.getItem("gioiTinh") || "";

document.getElementById("theHoTen").innerText=hoTen;

document.getElementById("theMaHS").innerText=maHS;

document.getElementById("theLop").innerText=lop;


//=======================
// TRƯỜNG
//=======================

const truongElement =
document.querySelector(".profile-item p");

if(truongElement){

    truongElement.innerText=truong;

}


//=======================
// DỮ LIỆU
//=======================

let tatCaKetQua=[];


//=======================
// CSV
//=======================

function csvToArray(csv){

    const rows=csv.trim().split("\n");

    const header=
    rows[0]
    .split(",")
    .map(x=>x.replace(/"/g,"").trim());

    const result=[];

    for(let i=1;i<rows.length;i++){

        const values=
        rows[i]
        .match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);

        if(!values) continue;

        const obj={};

        header.forEach((h,index)=>{

            obj[h]=
            values[index]
            ?
            values[index]
            .replace(/^"|"$/g,"")
            .trim()
            :
            "";

        });

        result.push(obj);

    }

    return result;

}



//=======================
// LẤY 1 SHEET
//=======================

async function loadSheet(url){

    try{

        const res=await fetch(url);

        const csv=await res.text();

        return csvToArray(csv);

    }

    catch(e){

        console.log(e);

        return [];

    }

}



//=======================
// LẤY TẤT CẢ SHEETS
//=======================

async function loadAllSheets(){

    tatCaKetQua=[];

    for(const ten in sheetURLs){

        const data=
        await loadSheet(sheetURLs[ten]);

        data.forEach(item=>{

            item.sheet=ten;

        });

        tatCaKetQua=
        tatCaKetQua.concat(data);

    }

}



//=======================
// LỌC THEO MÃ HS
//=======================

function layKetQuaHocSinh(){

    return tatCaKetQua.filter(item=>{

        return (
            item["Mã học sinh"]===maHS
        );

    });

}



//=======================
// ĐỊNH DẠNG ĐIỂM
//=======================

function lamTron(d){

    return Number(d||0).toFixed(2);

}



//=======================
// ĐỊNH DẠNG THỜI GIAN
//=======================

function doiTG(text){

    if(!text) return "";

    return text;

}



//=======================
// ĐỊNH DẠNG NGÀY
//=======================

function dinhDangNgay(str){

    if(!str) return "";

    return str;

}
/*=========================================================
        THỐNG KÊ - LỊCH SỬ - BIỂU ĐỒ
=========================================================*/

//======================
// BIẾN THỐNG KÊ
//======================

let diemCaoNhat = 0;
let soLuotThi = 0;
let soKyThi = 0;
let thuHang = "--";

let dsHocSinh = [];
let ketQuaHS = [];


//======================
// XẾP LOẠI
//======================

function xepLoai(diem){

    diem = Number(diem);

    if(diem >= 9) return "Xuất sắc";

    if(diem >= 8) return "Giỏi";

    if(diem >= 6.5) return "Khá";

    if(diem >= 5) return "Đạt";

    return "Chưa đạt";

}


//======================
// MÀU ĐIỂM
//======================

function classDiem(diem){

    diem = Number(diem);

    if(diem >= 9) return "diem-xuat-sac";

    if(diem >= 8) return "diem-gioi";

    if(diem >= 6.5) return "diem-kha";

    return "diem-yeu";

}


//======================
// TÍNH THỐNG KÊ
//======================

function thongKe(){

    ketQuaHS = layKetQuaHocSinh();

    soLuotThi = ketQuaHS.length;

    let kyThi = new Set();

    diemCaoNhat = 0;

    ketQuaHS.forEach(item=>{

        const diem = Number(item["Điểm"]) || 0;

        if(diem > diemCaoNhat){

            diemCaoNhat = diem;

        }

        kyThi.add(item["Kì thi"]);

    });

    soKyThi = kyThi.size;

    document.getElementById("diemCaoNhat").innerText =
        diemCaoNhat.toFixed(2);

    document.getElementById("soLuotThi").innerText =
        soLuotThi;

    document.getElementById("soKyThi").innerText =
        soKyThi;

}


//======================
// BẢNG LỊCH SỬ
//======================

function hienThiLichSu(){

    const tbody =
    document.getElementById("historyBody");

    tbody.innerHTML="";

    ketQuaHS.sort((a,b)=>{

        return Number(b["Điểm"])-Number(a["Điểm"]);

    });

    ketQuaHS.forEach((item,index)=>{

        const tr = document.createElement("tr");

        tr.innerHTML=`

        <td>${index+1}</td>

        <td>${item["Kì thi"]}</td>

        <td class="${classDiem(item["Điểm"])}">

            ${item["Điểm"]}

        </td>

        <td>

            ${item["Thời gian hoàn thành"]}

        </td>

        <td>

            ${item["Số lần rời tab"]}

        </td>

        <td>

            ${item["Ngày thi"]}

        </td>

        <td>

            ${xepLoai(item["Điểm"])}

        </td>

        `;

        tbody.appendChild(tr);

    });

}


//======================
// THỐNG KÊ TOÀN BỘ
//======================

function tinhThuHang(){

    dsHocSinh = [];

    tatCaKetQua.forEach(item=>{

        const ma = item["Mã học sinh"];

        const diem = Number(item["Điểm"]) || 0;

        if(!dsHocSinh[ma]){

            dsHocSinh[ma] = diem;

        }else{

            if(diem > dsHocSinh[ma]){

                dsHocSinh[ma] = diem;

            }

        }

    });

    let arr = [];

    for(let ma in dsHocSinh){

        arr.push({

            ma,

            diem:dsHocSinh[ma]

        });

    }

    arr.sort((a,b)=>b.diem-a.diem);

    const vt =
    arr.findIndex(x=>x.ma==maHS);

    if(vt!=-1){

        thuHang = vt+1;

    }

    document.getElementById("thuHang").innerText=
    thuHang;

}


//======================
// BIỂU ĐỒ
//======================

function veBieuDo(){

    const ctx =
    document.getElementById("scoreChart");

    const labels=[];

    const data=[];

    ketQuaHS.forEach(item=>{

        labels.push(item["Kì thi"]);

        data.push(Number(item["Điểm"]));

    });

    new Chart(ctx,{

        type:"bar",

        data:{

            labels:labels,

            datasets:[{

                label:"Điểm",

                data:data,

                borderWidth:2

            }]

        },

        options:{

            responsive:true,

            scales:{

                y:{

                    beginAtZero:true,

                    max:10

                }

            }

        }

    });

}



//======================
// KHỞI ĐỘNG
//======================

async function khoiDong(){

    await loadAllSheets();

    thongKe();

    tinhThuHang();

    hienThiLichSu();

    veBieuDo();

}
/*=========================================================
        THÀNH TÍCH - HUY HIỆU - CHỨC NĂNG
=========================================================*/

//======================
// THÀNH TÍCH
//======================

function hienThiThanhTich(){

    let giaiNhat = 0;
    let giaiNhi = 0;
    let giaiBa = 0;
    let chungNhan = 0;

    ketQuaHS.forEach(item=>{

        const diem = Number(item["Điểm"]) || 0;

        if(diem >= 9){

            giaiNhat++;

        }
        else if(diem >= 8){

            giaiNhi++;

        }
        else if(diem >= 6.5){

            giaiBa++;

        }

        if(diem >= 5){

            chungNhan++;

        }

    });

    document.getElementById("tongGiaiNhat").innerText = giaiNhat;

    document.getElementById("tongGiaiNhi").innerText = giaiNhi;

    document.getElementById("tongGiaiBa").innerText = giaiBa;

    document.getElementById("tongBangKhen").innerText = chungNhan;

}



//======================
// HUY HIỆU
//======================

function capNhatHuyHieu(){

    const badges =
    document.querySelectorAll(".badge-card");

    badges.forEach(x=>{

        x.style.opacity=".35";

    });

    // 10 điểm

    if(diemCaoNhat==10){

        badges[0].style.opacity="1";

    }

    // Top 10

    if(thuHang<=10){

        badges[1].style.opacity="1";

    }

    // Không rời tab

    let ok = ketQuaHS.some(item=>{

        return Number(item["Số lần rời tab"])===0;

    });

    if(ok){

        badges[2].style.opacity="1";

    }

    // Tham gia nhiều kỳ

    if(soKyThi>=3){

        badges[3].style.opacity="1";

    }

}



//======================
// AVATAR
//======================

function taiAvatar(){

    const avatar =
    localStorage.getItem("avatar");

    if(avatar){

        document.getElementById("avatarHocSinh").src=
        avatar;

    }

}



//======================
// QR
//======================

function taoQR(){

    const qr =
    document.querySelector(".qr-code");

    qr.src =
    "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data="+
    encodeURIComponent(maHS);

}



//======================
// ĐĂNG XUẤT
//======================

function dangXuat(){

    if(!confirm("Bạn có chắc muốn đăng xuất?")){

        return;

    }

    localStorage.removeItem("maThiSinh");

    localStorage.removeItem("tenThiSinh");

    localStorage.removeItem("hoTen");

    localStorage.removeItem("ngaySinh");

    localStorage.removeItem("lopThiSinh");

    localStorage.removeItem("truong");

    window.location="index.html";

}



//======================
// GẮN NÚT
//======================

document.querySelector(".member-btn")
.addEventListener("click",function(){

    alert("Xin chào " + hoTen);

});



//======================
// F5
//======================

window.addEventListener("focus",()=>{

    // Có thể cập nhật lại dữ liệu khi quay lại tab

});



//======================
// THÊM VÀO KHOI DONG
//======================

const khoiDongCu = khoiDong;

khoiDong = async function(){

    await khoiDongCu();

    hienThiThanhTich();

    capNhatHuyHieu();

    taiAvatar();

    taoQR();

}



//======================
// CHẠY
//======================

khoiDong();
const avatar = document.getElementById("avatarHocSinh");
const input = document.getElementById("chonAvatar");
const btn = document.getElementById("doiAvatar");

// Hiển thị ảnh đã lưu
const avatarDaLuu = localStorage.getItem("avatar");

if (avatarDaLuu) {

    avatar.src = avatarDaLuu;

}

// Chọn ảnh
btn.onclick = () => {

    input.click();

};

// Khi chọn ảnh
input.onchange = function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        avatar.src = e.target.result;

        localStorage.setItem("avatar", e.target.result);

        alert("Đã cập nhật ảnh đại diện.");

    };

    reader.readAsDataURL(file);

};
const taiKhoanBtn = document.getElementById("taiKhoanBtn");

if (taiKhoanBtn) {

    taiKhoanBtn.innerHTML =
        localStorage.getItem("hoTen") + " ▼";

    taiKhoanBtn.addEventListener("click", function (e) {

        e.preventDefault();

        const menu = document.getElementById("userDropdown");

        menu.style.display =
            menu.style.display === "block"
                ? "none"
                : "block";

    });

}
