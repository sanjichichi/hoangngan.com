const CSV_URLS = {
"Olympic Toán 2026":
"https://docs.google.com/spreadsheets/d/e/2PACX-1vTpyBmphKKF3lC2YXtIAU7GZO0R7te1Orvoi8KqmHx-PbMKfl2r8iNwz5Z5PA2iUr5ol9A1-AraIMvi/pub?output=csv",

"Olympic Ngữ văn 2026":
"https://docs.google.com/spreadsheets/d/e/2PACX-1vTQi1mhGw-K9xsKeYgqpe-n3XvALt-PcPb-oOkVxHJ2CLhyfy9QlzkgWnNK24zjQCWmO5q_YuMy5Sga/pub?output=csv",

"Olympic Tiếng Anh 2026":
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQtvs9nZ-1ab-DR-rekNM37FXv65Xz8va5RX-98kdy6kbCRrIZIaeO5GgPDZDZdklho2Wk2OuJx-yzZ/pub?output=csv",

"Olympic 2026":
"https://docs.google.com/spreadsheets/d/e/2PACX-1vT1XU2cW4LBuNHihn58r7svCjjtN06q_1e6BndfbPH6yja2nHhadihWkZIBzr7CSnWO5YLeGxMneJJK/pub?output=csv"

};

async function docCSV(url){

const response = await fetch(url);
const text = await response.text();

const rows = text.trim().split("\n");

return rows.slice(1).map(row => {

    const cols = row.split(",");

    return {

        timestamp: cols[0] || "",
        maHS: cols[1] || "",
        hoTen: cols[2] || "",
        lop: cols[3] || "",
        kyThi: cols[4] || "",
        diem: Number(cols[5] || 0),
        dung: Number(cols[6] || 0),
        sai: Number(cols[7] || 0),
        thoiGian: cols[8] || "",
        roiTab: Number(cols[9] || 0),
        ngayThi: cols[10] || ""

    };

});

}

async function taiDuLieu(){

let tatCa = [];

for(const url of Object.values(CSV_URLS)){

    const data = await docCSV(url);

    tatCa = tatCa.concat(data);

}

return tatCa;

}

function layKetQuaCaoNhat(data){

const ketQua = {};

data.forEach(hs => {

    const key =
    hs.maHS + "_" + hs.kyThi;

    if(!ketQua[key]){

        ketQua[key] = hs;

    }
    else{

        if(hs.diem >
           ketQua[key].diem){

            ketQua[key] = hs;

        }

    }

});

return Object.values(ketQua);

}

function parseThoiGian(tg){

    if(!tg) return 999999;

    const parts = tg.split(":");

    if(parts.length === 3){

        const gio = Number(parts[0]);
        const phut = Number(parts[1]);
        const giay = Number(parts[2]);

        return gio * 3600 +
               phut * 60 +
               giay;

    }

    return 999999;

}

function sapXep(data){

    return data.sort((a,b)=>{

        // Ưu tiên điểm

        if(b.diem !== a.diem){

            return b.diem - a.diem;

        }

        // Ưu tiên ít rời tab hơn

        if(a.roiTab !== b.roiTab){

            return a.roiTab - b.roiTab;

        }

        // Ưu tiên hoàn thành nhanh hơn

        const tgA =
        parseThoiGian(a.thoiGian);

        const tgB =
        parseThoiGian(b.thoiGian);

        return tgA - tgB;

    });

}

function hienThiBang(data){

const tbody =
document.getElementById("rankingBody");

document.getElementById("tongThiSinh")
.innerText = "Tổng số thí sinh: " + data.length;

tbody.innerHTML = "";

data.forEach((hs,index)=>{

    let css = "";

    if(index === 0){
        css = "hang1";
    }
    else if(index === 1){
        css = "hang2";
    }
    else if(index === 2){
        css = "hang3";
    }

    tbody.innerHTML += `
    <tr class="${css}">
        <td>${index+1}</td>
        <td>${hs.maHS}</td>
        <td>${hs.hoTen}</td>
        <td>${hs.lop}</td>
        <td>${hs.kyThi}</td>
        <td>${hs.diem}</td>
        <td>${hs.roiTab}</td>
        <td>${hs.thoiGian}</td>
    </tr>
    `;

});

}


async function khoiTao(){

let data =
await taiDuLieu();

data =
layKetQuaCaoNhat(data);

const boLoc =
document.getElementById("filterExam");

boLoc.addEventListener("change",()=>{

    let ds = [...data];

    if(boLoc.value !== "Tất cả"){

        ds =
        ds.filter(
        x=>x.kyThi === boLoc.value
        );

    }

    ds = sapXep(ds);

    hienThiBang(ds);

});

data = sapXep(data);

hienThiBang(data);

}

khoiTao();
