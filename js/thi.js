

let cauHoi = [];
// Chặn nút Back
// Đếm số lần nhấn nút Back
let soLanBack = 0;
history.pushState(null, "", location.href);

let kyThi =
localStorage.getItem(
    "kyThi"
);
console.log("Kỳ thi:", kyThi);
console.log("Toán:", typeof cauHoiToan);

console.log("Văn:", typeof cauHoiVan);

console.log("Anh:", typeof cauHoiAnh);
if(
    kyThi ===
    "Olympic Toán 2026"
){

    cauHoi =
    cauHoiToan;

}

else if(
    kyThi ===
    "Olympic Ngữ văn 2026"
){

    cauHoi =
    cauHoiVan;

}

else if(
    kyThi ===
    "Olympic Tiếng Anh 2026"
){

    cauHoi =
    cauHoiAnh;

}

else if(
    kyThi ===
    "Olympic tổng hợp 2026"
){

    cauHoi =
    cauHoiOlimpic;

}
console.log("Số câu:", cauHoi.length);
// SỐ LƯỢNG CÂU HỎI

cauHoi = cauHoi.slice(0,50);
// Theo dõi nút Back
history.pushState(null, "", location.href);

window.addEventListener("popstate", function () {

    soLanBack++;

    if (soLanBack === 1) {

        alert("⚠️ Bạn đã nhấn nút Quay lại.\nNếu nhấn thêm lần nữa, bài thi sẽ được nộp tự động.");

        history.pushState(null, "", location.href);

    } else {

        alert("❌ Bạn đã nhấn Quay lại 2 lần.\nHệ thống sẽ tự động nộp bài.");

        nopBaiChinhThuc();

    }

});
function hienThiCauHoi(){

    let html = "";

    cauHoi.forEach(function(cau,index){

        html += `
        <div class="question" id="cau${index+1}">

            <h3>Câu ${index+1}</h3>

            <p>${cau.cauHoi}</p>

            <label>
            <input type="radio"
            name="cau${index+1}"
            value="A">
            ${cau.A}
            </label>

            <label>
            <input type="radio"
            name="cau${index+1}"
            value="B">
            ${cau.B}
            </label>

            <label>
            <input type="radio"
            name="cau${index+1}"
            value="C">
            ${cau.C}
            </label>

            <label>
            <input type="radio"
            name="cau${index+1}"
            value="D">
            ${cau.D}
            </label>

        </div>
        `;
    });

    document.getElementById(
        "khuVucCauHoi"
    ).innerHTML = html;

}
function taoThanhDieuHuong(){

    let html = "";

    cauHoi.forEach(function(cau,index){

        html += `
        <button
            type="button"
            id="nav${index+1}"
            class="nav-btn"
            onclick="diDenCau(${index+1})">
            ${index+1}
        </button>
        `;

    });

    document.getElementById("questionNavContainer").innerHTML = html;

}

function diDenCau(so){

    document.getElementById("cau"+so).scrollIntoView({
        behavior:"smooth",
        block:"start"
    });

}

function khoiTaoSuKien(){

    cauHoi.forEach(function(cau,index){

        document
        .querySelectorAll(
            `input[name="cau${index+1}"]`
        )
        .forEach(function(input){

            input.addEventListener(
                "change",
                function(){

                    document
                    .getElementById(
                        `nav${index+1}`
                    )
                    .classList.add(
                        "done-question"
                    );

                    capNhatTienDo();

                }
            );

        });

    });

}
if(!localStorage.getItem("maThiSinh")){

    alert("Vui lòng đăng nhập!");

    window.location.href =
    "login.html";
}
let time = 1800
if(localStorage.getItem("thoiGianConLai")){

    time = parseInt(
        localStorage.getItem("thoiGianConLai")
    );

}

let timer = setInterval(function(){

    let minutes =
    Math.floor(time / 60);

    let seconds =
    time % 60;

    document.getElementById("timer")
    .innerHTML =
    minutes + ":" +
    String(seconds).padStart(2,"0");

    time--;

    if(time < 0){

    clearInterval(timer);

    alert(
        "Đã hết thời gian làm bài. Hệ thống sẽ tự động nộp bài."
    );

    nopBaiChinhThuc();

    }

},1000);
function capNhatTienDo(){

    let dem = 0;

    cauHoi.forEach(function(cau,index){

        if(
            document.querySelector(
                `input[name="cau${index+1}"]:checked`
            )
        ){
            dem++;
        }

    });

    document.getElementById(
        "soCauDaLam"
    ).innerHTML = dem;

}
function nopBaiChinhThuc(){

    let diem = 0;

    cauHoi.forEach(function(cau,index){

    let luaChon =
    document.querySelector(
        `input[name="cau${index+1}"]:checked`
    );

    if(
        luaChon &&
        luaChon.value === cau.dapAn
    ){
        diem++;
    }

    });
    localStorage.setItem(
    "diemThi",
    diem
);
let daDung =
1800 - time;

let phut =
Math.floor(daDung / 60);

let giay =
daDung % 60;

let tg =
phut + ":" +
String(giay).padStart(2,"0");

localStorage.setItem(
    "thoiGianHoanThanh",
    tg
);

localStorage.setItem(
    "tongSoCau",
    cauHoi.length
);

localStorage.setItem(
    "soCauSai",
    cauHoi.length - diem
);
localStorage.setItem(
    "kyThi",
    kyThi
);

localStorage.setItem(
    "soLanRoiTab",
    soLanRoiTab
);
window.location.href =
"ketqua.html";

    document
    .querySelectorAll("input")
    .forEach(function(input){

        input.disabled = true;

    });

    document
    .querySelector(".submit-btn")
    .disabled = true;

    document
    .querySelector(".submit-btn")
    .innerHTML =
    "ĐÃ NỘP BÀI";
}
function nopBai(){

    let xacNhan = confirm(
        "Bạn có chắc chắn muốn nộp bài?"
    );

    if(!xacNhan){
        return;
    }

    nopBaiChinhThuc();

}
document.getElementById("tenThiSinh").innerHTML =
localStorage.getItem("tenThiSinh");

document.getElementById("lopThiSinh").innerHTML =
localStorage.getItem("lopThiSinh");

document.getElementById("ngaySinh").innerHTML =
localStorage.getItem("ngaySinh");
cauHoi.sort(() => Math.random() - 0.5);
hienThiCauHoi();

taoThanhDieuHuong();

khoiTaoSuKien();

document.getElementById("tongSoCau").innerHTML =
cauHoi.length;
let soLanRoiTab = 0;
document.addEventListener(
"visibilitychange",

function(){

    if(document.hidden){

        soLanRoiTab++;

        alert(

        "Bạn đã rời khỏi màn hình thi lần " +

        soLanRoiTab +

        "/3"

        );

        if(soLanRoiTab >= 3){

            alert(

            "Bạn đã vi phạm quy chế thi.\nHệ thống sẽ tự động nộp bài."

            );

            nopBaiChinhThuc();

        }

    }

});
document.addEventListener(
"fullscreenchange",

function(){

    if(
    !document.fullscreenElement
    ){

        alert(
        "Không được thoát chế độ toàn màn hình!"
        );

    }

});